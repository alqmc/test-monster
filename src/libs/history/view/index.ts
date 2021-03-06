import { FileOrFolder } from '../../../source/store/script';
import { NativeBase } from '../../types';
import { ScriptType } from '../../utils/const';
import { getEnumDisplay } from './../../utils';
// 记录提示倒计时
export class NativeMask extends NativeBase {
  constructor() {
    super('test-monster-mask', 'block');
  }
  /**
   *
   * @param time 持续时间
   */
  init(time: number, title: string = '开始记录') {
    return new Promise((resolve, reject) => {
      if (this.example) {
        this.example.innerHTML = `<span data-test-monster='true' class='test-monster-mask-text'>${title}:${time}</span>`;
        this.show();
        let t1 = setInterval(() => {
          if (!this.example) return;
          time--;
          this.example.innerHTML = `<span data-test-monster='true' class='test-monster-mask-text'>${title}:${time}</span>`;
          if (time === 0) {
            this.hidden();
            clearInterval(t1);
            resolve('mask is hidden!');
          }
        }, 1000);
      } else {
        reject('实例未初始化！');
      }
    });
  }
}
// 工具栏
export class NativeTool extends NativeBase {
  constructor(handleStop: () => void, title: string = '记录中') {
    super('test-monster-tool', 'flex');
    this.appendChild(handleStop, title);
  }
  appendChild(handleStop: () => void, title: string) {
    if (this.example) {
      const stop = document.createElement('div');
      stop.dataset.testMonster = 'true';
      stop.className = 'test-monster-tool-stop';
      stop.addEventListener('click', handleStop);
      const text = document.createElement('div');
      text.dataset.testMonster = 'true';
      text.className = 'test-monster-tool-text';
      text.innerText = `Test Monster ${title}`;
      this.example.appendChild(text);
      this.example.appendChild(stop);
    }
  }
}
// 事件记录tips
import { UUID } from './../../utils/index';
const recordList: Array<{ id: string; el: HTMLElement }> = [];
export class NativeRecord extends NativeBase {
  id = UUID();
  message = '';
  constructor(message: string, className: string = '') {
    super(`test-monster-record ${className}`, 'block');
    this.message = message;
    if (this.example) {
      this.example.style.top = (recordList.length + 1) * 50 + 'px';
      recordList.push({
        id: this.id,
        el: this.example,
      });
      this.updateRecord();
    }
    this.appendChild();
  }
  updateRecord() {
    recordList.forEach((x, index) => {
      x.el.style.top = (index + 1) * 60 + 'px';
    });
  }
  appendChild() {
    if (this.example) {
      const close = document.createElement('div');
      close.className = 'test-monster-record-close';
      close.dataset.testMonster = 'true';
      close.innerText = '×';
      close.addEventListener('click', () => {
        this.destroy();
      });
      const text = document.createElement('div');
      text.className = 'test-monster-record-message';
      text.dataset.testMonster = 'true';
      text.innerHTML = `<div data-test-monster='true'>${this.message}</div>`;
      this.example.appendChild(text);
      this.example.appendChild(close);
    }
  }
  destroy() {
    const App = document.querySelector('#app');
    if (this.example) App ? App.removeChild(this.example) : document.body.removeChild(this.example);
    this.example = undefined;
    this.status = 0;
    for (let i = 0; i < recordList.length; i++) {
      if (recordList[i].id === this.id) {
        recordList.splice(i, 1);
        i--;
      }
    }
    this.updateRecord();
  }
  autoClose(time: number) {
    this.show();
    let t = setTimeout(() => {
      this.destroy();
      clearTimeout(t);
    }, time);
  }
}

interface NativeTrayHandle {
  change?: (value: any) => void;
  input?: (value: any) => void;
}
/** 脚本检索 */
export class NativeTray extends NativeBase {
  trayInput = new NativeBase('test-monster-tray-input', 'block', 'input');
  trayOption: undefined | NativeBase = undefined;
  constructor({ change, input }: NativeTrayHandle) {
    super('test-monster-tray', 'block');
    const Tray = this.example;
    if (this.example && this.trayInput.example) {
      (this.trayInput.example as HTMLInputElement).placeholder = 'Hi，Test-Monster！';
      (this.trayInput.example as HTMLInputElement).autofocus = true;
      this.trayOption = new NativeBase('test-monster-tray-options', 'block', 'div', this.example);
      this.example.appendChild(this.trayInput.example);
      if (change) {
        this.trayInput.example.addEventListener('change', (Event) => {
          change(Event);
        });
      }
      if (input) {
        const trayInput = this.trayInput;
        const trayOption = this.trayOption;
        if (trayInput.example) {
          trayInput.example.addEventListener('input', (Event) => {
            if (Tray && trayOption.example) {
              Tray.appendChild(trayOption.example);
              input(Event);
            }
          });
        }
        input('init');
      }
    }
  }
  updateOptions(options: Array<FileOrFolder>, handleRun: (value: FileOrFolder) => void) {
    const trayOption = this.trayOption;
    if (options && trayOption && trayOption.example) {
      trayOption.example.innerHTML = '';
      options.forEach((x) => {
        const trayOptionItem = new NativeBase('test-monster-tray-option-item', 'flex');
        const trayOptionRunBtn = new NativeBase('test-monster-tray-option-btn', 'block');
        const trayOptionConetnt = new NativeBase('test-monster-tray-option-conetnt', 'block');
        const trayBtnContent = new NativeBase('test-monster-tray-btn-conetnt', 'block');
        const trayOptionTip = new NativeBase(`test-monster-tray-option-tip test-monster-tip-success`, 'block');
        if (
          trayOption.example &&
          trayOptionRunBtn.example &&
          trayOptionItem.example &&
          trayOptionConetnt.example &&
          trayOptionTip.example &&
          trayBtnContent.example
        ) {
          trayOptionConetnt.example.innerText = x.name;
          trayOptionTip.example.innerText = getEnumDisplay(x.scriptType, ScriptType);
          trayOptionItem.example.appendChild(trayOptionConetnt.example);
          trayOptionConetnt.example.appendChild(trayOptionTip.example);
          trayOptionRunBtn.example.innerText = '执行';
          trayOptionRunBtn.example.addEventListener('click', () => {
            handleRun(x);
          });
          trayBtnContent.example.appendChild(trayOptionRunBtn.example);
          trayOptionItem.example.appendChild(trayBtnContent.example);
          trayOption.example.appendChild(trayOptionItem.example);
        }
      });
    }
  }
}

export class NativeMouse extends NativeBase {
  Mouse = new NativeBase('test-monster-mouse-icon', 'block', 'img');
  x = undefined;
  y = undefined;
  constructor() {
    super('test-monster-mouse', 'block');
    if (this.Mouse.example) this.example?.appendChild(this.Mouse.example);
  }
  autoClick(x: string, y: string): void {
    if (this.example) {
      this.example.style.top = y + 'px';
      this.example.style.left = x + 'px';
    }
    setTimeout(() => {
      this.destroy();
    }, 3000);
  }
}
