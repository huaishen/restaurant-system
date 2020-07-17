import Vue from 'vue'
import {
  Button, Form, FormItem, Input, Message, Header, Container, Aside, Main, Menu, MenuItem, Submenu,
  Row, Col, Breadcrumb, BreadcrumbItem, Table, TableColumn, Tooltip, Pagination, Dialog, Select, DatePicker,
  Option, Loading, MessageBox
} from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

locale.use(lang)

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Header)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(DatePicker)
Vue.use(Option)
Vue.use(Loading)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
