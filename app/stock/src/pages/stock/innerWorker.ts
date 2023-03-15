/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2021-09-14 11:34:17
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-02-04 16:36:35
 * @FilePath: /stock/stock-umi/src/pages/stock/innerWorker.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
// worker.js blob 版
const workercode = () => {
  let lock = 0;

  self.onmessage = function (e) {
    if (lock > 0) {
      return self.postMessage({ type: 'locked' });
    }
    lock++;
    console.log('self.onmessage', e);
    console.log('lock', lock);
  };

  self.onerror = function (e) {
    console.log(e);
  };
};

let code = workercode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));
const blob = new Blob([code], { type: 'application/javascript' });
export default URL.createObjectURL(blob);
