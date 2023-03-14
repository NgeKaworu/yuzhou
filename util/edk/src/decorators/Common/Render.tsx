/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-05 16:48:01
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-14 23:48:30
 * @FilePath: /yuzhou/util/edk/src/decorators/Common/Render.tsx
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import type { ReactElement } from 'react';
/**
 * custom render 切片
 */
export default <P extends any = any>(render: (origin: ReactElement<P>) => ReactElement<P>) =>
  (Element: ReactElement<P>) => {
    return render?.(Element) ?? Element;
  };
