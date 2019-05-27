<template>
    <div id="SeachBarMid">
        <el-select v-model="selectColumn">
            <el-option
                v-for="item in searchColumnArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
        <el-select v-model="selectValue" v-if="isSelect">
            <el-option
                v-for="item in searchOptionArr[selectColumn]"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
        <el-input v-else v-model="inputValue"></el-input>
    </div>
</template>

<script>
    import moment from 'moment'

    export default {
        name: "SearchBarMid",
        props: {
            //选择器-需要搜索的字段名
            //[{value:'aaa',label:'bbb'},....]
            searchColumnArr: {
                type: Array,
                default:function(){ return []},
            },
            //字典-对应字段需要输入框组件或选择器组件
            //{value1:true,....},....
            isSelectCom: {
                type: Object,
                default:function(){ return {}},
            },            
            //字典-对应字段的选项字典
            /** {value1:
             * [{label:'aaa',value:'bbb'},....]
             * ,...}
             *  */
            searchOptionArr:{
                type: Object,
                default:function() {return {}}
            }
        },
        data() {
            return {
                selectColumn:null,
                selectValue:null,
                inputValue:null,
                isSelect:false,
            }
        },
        methods: {

        },
        computed: {
        },
        watch: {
            selectColumn(nval,oval){
                this.isSelect=this.isSelectCom[nval];
                if(nval!=oval){
                    // 清空搜索栏属性
                    this.inputValue="";
                    this.selectValue="";
                }
            },
            inputValue(val){
                if(val!='') this.$emit('searchInfo',{
                    searchColumn:this.selectColumn,
                    searchContent:val
                })
            },
            selectValue(val){
                if(val!='') this.$emit('searchInfo',{
                    searchColumn:this.selectColumn,
                    searchContent:val
                })
            }

        },
        mounted() {
        },
        created() {
        }
    }
</script>

<style scoped>
    @import "../../assets/css/fontawasome/css/all.min.css";

</style>
