import '../lib/ace/ace.js';

ace.config.set('basePath', '/lib/ace');

export const Roles = {
  UNDEFINED: {
    value: 'UNDEFINED',
    id: 'role-selection'
  },
  PUB: {
    value: 'PUB',
    id: 'publisher'
  },
  SUBCON: {
    value: 'SUBCON',
    id: 'subscriber-connector'
  },
  SUB: {
    value: 'SUB',
    id: 'subscriber'
  }
};

export const Status = {
  NOT_CONNECTED: 'NOT_CONNECTED',
  RECONNECTING: 'RECONNECTING',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  ERROR: 'ERROR'
};

export const getEditor = (mountingPoint) => {
  const editor = ace.edit(mountingPoint);
  editor.setTheme("ace/theme/textmate");
  editor.session.setMode("ace/mode/markdown");
  editor.setFontSize(12);
  editor.setOption("wrap", 100);
  editor.setOption("printMarginColumn", 100);
  editor.setOption("useSoftTabs", true);
  editor.setOption("readOnly", true);
  editor.setOption("showInvisibles", true);
  editor.commands.addCommand({
    name: "cmd-select-more-after",
    bindKey: {win: "Alt-J"},
    exec: (editor) => editor.execCommand("selectMoreAfter")
  });
  return editor;
};

export const setHost = (value) => new Promise((resolve) => {
  console.debug("setting host: " + value);
  const d = new Date();
  d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = "host=" + value + ";" + expires + ";path=/";
  resolve(value);
});

export const getHost = () => new Promise((resolve) => {
  const name = "host=";
  let decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  let value = "";
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      value = c.substring(name.length, c.length);
      break;
    }
  }
  if (value === "") {
    value = "localhost:8080";
    console.debug("new host: " + value);
    setHost(value);
  } else {
    console.debug("existing host: " + value);
  }
  resolve(value);
});