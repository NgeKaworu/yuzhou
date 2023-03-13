// User 用户schema
export default interface User {
  id: string; // id
  name: string; // 用户昵称
  pwd: string; // 密码
  email: string; // 邮箱
  createAt: string; // 创建时间
  updateAt: string; // 更新时间
  roles: string[]; // 角色列表
}
