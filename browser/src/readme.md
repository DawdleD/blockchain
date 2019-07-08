改动说明（2019.5.20）：
router.js
增加了新组件的路由配置。
教师管理页面的相关组件被暂时放于Profile路由中，待调整

store.js
增加了用于初始化合约实例、以太坊接口实例的state、mutation和Action

main.js
添加了对elemeui的组件引用

utils/
包含一系列用于获取以太坊实例的函数库，其中getUploadToken未用到

utils/constant
eproject_abi.js包含链上合约的ABI接口与合约地址。在本地虚拟环境中部署合约时需进行相应修改。
options.js包含用于前端显示的选项常量值

views/
无重要修改

components/

components/common/
informationDialog.vue：封装了一个用于显示对象信息的对话框
SearchBar_mid.vue：封装了一个搜索框组件（在教师管理页面中使用）

components/project/
CourseBread.vue 未被使用
Information.Vue 项目详情页面组件
List.vue 项目列表页面组件
SortPage.vue 分页组件

components/profile/
Wallet.vue 支付/我的钱包
Project.vue 我的项目/项目申请

（教师管理界面组件）
Project_teacher.vue 项目管理
AttendApplyManagement_teacher 学生报名项目申请的管理界面
CreateApplyManagement_teacher 教师创建项目申请的管理界面
ProjectMember_teacher 项目成员管理界面


改动说明-0708

router.js:增加了教师管理界面的路由部分


components\common\SearchBar_mid.vue:更改组件样式并完善功能


views\teacher\Course.vue:教师管理界面的入口界面


components\teacher\project\Project_teacher.vue、components\teacher\project\ProjectMember_teacher.vue、components\teacher\project\CreateApplyManagement_teacher.vue、components\teacher\project\AttendApplyManagement_teacher.vue：
教师管理界面组件


后端部分：


controllers\project\projectquery.js、service\project-information.js：对于项目信息的查询逻辑进行了修改