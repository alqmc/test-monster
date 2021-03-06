/**
 * url 是否存在于keys
 * @param url
 * @param keys
 * @returns
 */
export const IsurlExait = (url: string, keys: Array<string>) => {
  let isExist = false;
  keys.forEach((val) => {
    if (url.indexOf(val) >= 0) {
      isExist = true;
    }
  });
  return isExist;
};
// 生成uuid
export const UUID = (): string => {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16);
  });
  return uuid;
};

// 生成随机码
export const createRandomCode = (len = 6) => {
  const charset = `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`;
  const maxLen = charset.length;
  let ret = '';
  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * maxLen);
    ret += charset[randomIndex];
  }
  return ret;
};

// 生成下载文件
export const loadFile = (fileName: string, content: string) => {
  let aLink = document.createElement('a');
  let blob = new Blob([content], {
    type: 'text/plain',
  });
  aLink.download = fileName;
  aLink.href = URL.createObjectURL(blob);
  aLink.click();
  URL.revokeObjectURL(blob.toString());
};

/**
 * 删除所有cookies
 */
export const clearAllCookie = () => {
  let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if (keys) {
    for (let i = keys.length; i--; ) document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
  }
};
/**
 * 获取元素Xpath
 * @param el
 * @returns
 */
export const getXPath = (el: Element) => {
  let nodeElem = el;
  if (nodeElem.id) {
    return `//*[@id="${nodeElem.id}"]`;
  }
  const parts = [];
  while (nodeElem && nodeElem.nodeType === Node.ELEMENT_NODE) {
    let nbOfPreviousSiblings = 0;
    let hasNextSiblings = false;
    let sibling = nodeElem.previousElementSibling;
    while (sibling && sibling !== document.body) {
      if (sibling.nodeType !== Node.DOCUMENT_TYPE_NODE && sibling.nodeName === nodeElem.nodeName) {
        if (!(sibling as any).dataset.testMonster) {
          // 排除注入元素
          nbOfPreviousSiblings++;
        }
      }
      sibling = sibling.previousElementSibling;
    }
    sibling = nodeElem.nextElementSibling;
    while (sibling && sibling !== document.body) {
      if (sibling.nodeName === nodeElem.nodeName) {
        if (!(sibling as any).dataset.testMonster) {
          // 排除注入元素
          hasNextSiblings = true;
          break;
        }
      }
      sibling = sibling.nextElementSibling;
    }
    const prefix = nodeElem.prefix ? nodeElem.prefix + ':' : '';
    const nth = nbOfPreviousSiblings || hasNextSiblings ? `[${nbOfPreviousSiblings + 1}]` : '';
    parts.push(prefix + nodeElem.localName + nth);
    if (nodeElem.parentNode) nodeElem = nodeElem.parentNode as Element;
  }
  let rst = parts.length ? '/' + parts.reverse().join('/') : '';
  rst = rst
    .replace(/\/g/g, '/*[name()="g"]')
    .replace(/\/svg/g, '/*[name()="svg"]')
    .replace(/\/path/g, '/*[name()="path"]');
  return rst;
};
/**
 * 根据xpath获取元素
 * @param xpath
 * @returns
 */
export const getELementXpath = (xpath: string) => {
  let result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
  return result.iterateNext();
};
/**
 * img to base64
 * @param img
 * @returns
 */
export function image2Base64(img: any) {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const dataURL = canvas.toDataURL('image/png');
    return dataURL;
  }
}
/**
 * 触发事件
 * @param eventName
 * @param el
 */
interface KeyboardConfig {
  key: string;
  code: string;
  keyCode: number;
}
interface MouseEventConfig {
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
}
export const dispatchEventHandler = (
  eventName: string,
  el: Element | Document,
  config?: { keyboardConfig?: KeyboardConfig; mouseEventConfig?: MouseEventConfig }
) => {
  if (el || eventName === 'keyup' || eventName === 'keydown') {
    switch (eventName) {
      case 'focus':
        (el as HTMLInputElement).focus();
        break;
      case 'blur': {
        (el as HTMLInputElement).blur();
        break;
      }
      case 'input':
        {
          const inputEvent = new InputEvent('input');
          el.dispatchEvent(inputEvent);
        }
        break;
      case 'change': {
        const changeEvent = new InputEvent('change');
        el.dispatchEvent(changeEvent);
      }
      case 'mousedown': {
        const mouseEvent = new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
          view: window,
        });
        el.dispatchEvent(mouseEvent);
        break;
      }
      case 'keyup': {
        if (config && config.keyboardConfig) {
          const keyboardEvent = new KeyboardEvent('keyup', {
            ...config.keyboardConfig,
            location: 1,
            bubbles: true,
            cancelable: true,
            composed: true,
          });
          document.body.dispatchEvent(keyboardEvent);
        }
        break;
      }

      case 'keydown': {
        if (config && config.keyboardConfig) {
          const keyboardEvent = new KeyboardEvent('keydown', {
            ...config.keyboardConfig,
            shiftKey: config.keyboardConfig.keyCode === 16,
            altKey: config.keyboardConfig.keyCode === 18,
            location: 1,
            bubbles: true,
            cancelable: true,
            composed: true,
          });
          document.body.dispatchEvent(keyboardEvent);
        }
        break;
      }

      case 'mouseup': {
        const mouseEvent = new MouseEvent('mouseup', {
          bubbles: true,
          cancelable: true,
          view: window,
        });
        el.dispatchEvent(mouseEvent);
        break;
      }
      default:
        if (config && config.mouseEventConfig) {
          const event = new MouseEvent(eventName, { ...config.mouseEventConfig, cancelable: false, bubbles: true });
          el.dispatchEvent(event);
        } else {
          const event = new MouseEvent(eventName, { cancelable: false, bubbles: true });
          el.dispatchEvent(event);
        }
    }
  }
};
/**
 * 事件监听
 * @param event
 * @param callback
 */
export const addEventListener = <T>(
  event: string,
  callback: (e: T extends Event ? Event : any) => void,
  source: Document | Window | Node = document
) => {
  source.addEventListener(event, callback, { capture: true, passive: true });
};
/**
 * 移除事件监听
 * @param event
 * @param callback
 */
export const removeEventListener = <T>(
  event: string,
  callback: (e: T extends Event ? Event : any) => void,
  source: Document | Window | Node = document
) => {
  source.removeEventListener(event, callback);
};

/**
 * 等待几秒
 * @param time
 * @returns
 */
export const sleep = (time: number): Promise<void> => {
  return new Promise((reslove, reject) => {
    try {
      let tirmer = setTimeout(() => {
        reslove();
        clearTimeout(tirmer);
      }, time);
    } catch (error) {
      reject();
    }
  });
};

// 监听元素变动
export const mutationObserver = (target: Element, callback: MutationCallback) => {
  const config = { attributes: false, childList: true, subtree: true };
  const observer = new MutationObserver(callback);
  observer.observe(target, config);
  return observer;
};

/**
 * 枚举数组值转显示
 * @param value 枚举id值
 * @param source 数据源，目前限定 {value,label} 为item的数据源
 */
export function getEnumDisplay(value: string, source: Array<Record<string, string>>, option = { value: 'key', label: 'value' }) {
  if (value !== null && value !== undefined && source && Array.isArray(source)) {
    const s = source.find((x) => x[option.value].toString() === value.toString());
    return s ? s[option.label] : value;
  }
  return value;
}
