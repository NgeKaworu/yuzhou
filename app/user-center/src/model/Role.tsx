// Role 角色schema
export default interface Role {
  id: string; // id
  name: string; // 角色名
  createAt: string; // 创建时间
  updateAt: string; // 更新时间
  perms: string[]; // 权限列表
}
