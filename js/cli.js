/* global $, localStorage, Shell */

const errors = {
  invalidDirectory: 'cd: no such file or directory: ',
  invalidOptionOrDirectory: 'ls: no such option or directory: ',
  noWriteAccess: 'Warning: console cowboys read only',
  fileNotFound: 'cat: no such file or directory: ',
  fileNotSpecified: 'Error: filename argument required',
};

const struct = {
  happy_hacker: ['about', 'resume', 'contact'],
  Projects: ['nodemessage', 'map', 'dotify', 'slack_automation'],
  Skills: ['languages', 'frameworks'],
};

const commands = {};
let systemData = {};
const happy_hackerPath = '/Users/happy_hacker';

const getDirectory = () => localStorage.directory;
const setDirectory = dir => {
  localStorage.directory = dir;
};

// turn on fullscreen
const registerFullscreenToggle = () => {
  $('.button.green').click(() => {
    $('.terminal-window').toggleClass('fullscreen');
  });
};

commands.mkdir = () => errors.noWriteAccess;

commands.touch = () => errors.noWriteAccess;

commands.rm = () => errors.noWriteAccess;

commands.ls = directory => {
  const currDir = getDirectory();
  directory = directory ? directory.trim() : '';
  if (directory === '..' || directory === '~') {
    return systemData['happy_hacker'];
  } else if (
    (currDir === 'happy_hacker' && directory === 'Projects') ||
    (currDir === 'happy_hacker' && directory === 'Skills') ||
    (currDir !== 'happy_hacker' && directory === '../Projects') ||
    (currDir !== 'happy_hacker' && directory === '../Skills')
  ) {
    if (directory.substring(0, 3) === '../') {
      return systemData[directory.substring(3)];
    } else {
      return systemData[directory];
    }
  } else if (directory === '' || directory === '-a' || directory === 'l' || directory === '-la') {
    return systemData[getDirectory()];
  }

  return errors.invalidOptionOrDirectory + directory;
};

commands.help = () => systemData.help;

commands.pwd = () => {
  const dir = getDirectory();
  return dir === 'happy_hacker' ? happy_hackerPath : `${happy_hackerPath}/${dir}`;
};

commands.history = () => {
  let history = localStorage.history;
  history = history ? Object.values(JSON.parse(history)) : [];
  return `<p>${history.join('<br>')}</p>`;
};

commands.cd = newDirectory => {
  const currDir = getDirectory();
  const dirs = Object.keys(struct);
  const newDir = newDirectory ? newDirectory.trim() : '';

  if (
    (dirs.includes(newDir) && currDir === 'happy_hacker') ||
    ((newDir === '../Projects' || newDir === '../Skills') && currDir !== 'happy_hacker')
  ) {
    if (newDir.substring(0, 3) === '../') {
      setDirectory(newDir.substring(3));
    } else {
      setDirectory(newDir);
    }
  } else if (newDir === '' || newDir === '~' || (newDir === '..' && dirs.includes(currDir))) {
    setDirectory('happy_hacker');
  } else {
    return errors.invalidDirectory + newDir;
  }
  return null;
};

commands.cat = filename => {
  if (!filename) {
    return errors.fileNotSpecified;
  }

  const dir = getDirectory();
  const fileKey = filename.split('.')[0];

  if (fileKey in systemData && struct[dir].includes(fileKey)) {
    return systemData[fileKey];
  }

  return errors.fileNotFound + filename;
};

// initialize cli
$(() => {
  registerFullscreenToggle();
  const cmd = document.getElementById('terminal');
  const terminal = new Shell(cmd, commands);

  $.ajaxSetup({cache: false});
  $.get('data/system_data.json', data => {
    systemData = data;
  });
});
