/* global $, localStorage, Shell */

const errors = {
  invalidDirectory: 'cd: no such file or directory: ',
  noWriteAccess: 'Warning: console cowboys read only',
  fileNotFound: 'cat: no such file or directory: ',
  fileNotSpecified: 'Error: filename argument required',
};

const struct = {
  happy_hacker: ['about', 'resume', 'contact'],
  Projects: ['nodemessage', 'map', 'dotify', 'slack_automation'],
  Skills: ['proficient', 'familiar', 'learning'],
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
  if (directory === '..' || directory === '~') {
    return systemData['happy_hacker'];
  } else if (directory === 'Projects' || directory === 'Skills') {
    return systemData[directory];
  }

  return systemData[getDirectory()];
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

  if (dirs.includes(newDir) && currDir !== newDir) {
    setDirectory(newDir);
  } else if (newDir === '' || newDir === '~' || (newDir === '..' && dirs.includes(currDir))) {
    setDirectory('happy_hacker');
  } else {
    return errors.invalidDirectory + newDir;
  }
  return null;
};

commands.cat = filename => {
  if (!filename) return errors.fileNotSpecified;

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
