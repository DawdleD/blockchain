<template>
<div id="SeachBarMid">
    <el-row :gutter="20">
        <el-col :span="8">
            <el-select v-model="selectColumn">
                <el-option v-for="item in searchColumnArr" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </el-col>

        <el-col :span="4" :offset="2">
            <el-select v-model="selectValue" v-if="isSelect">
                <el-option v-for="item in searchOptionArr[selectColumn]" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-input  v-else v-model="inputValue"></el-input>
        </el-col>
        <el-col :span="3" :offset="2">
            <el-button @click="emitSearchEvent">搜索</el-button>
        </el-col>
        <el-col :span="3">
            <el-button @click="clearSearchEvent">重置</el-button>
        </el-col>        
    </el-row>

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
            default: function() {
                return []
            },
        },
        //字典-对应字段需要输入框组件或选择器组件
        //{value1:true,....},....
        isSelectCom: {
            type: Object,
            default: function() {
                return {}
            },
        },
        //字典-对应字段的选项字典
        /** {value1:
         * [{label:'aaa',value:'bbb'},....]
         * ,...}
         *  */
        searchOptionArr: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    data() {
        return {
            selectColumn: null,
            selectValue: null,
            inputValue: null,
            isSelect: false,
        }
    },
    methods: {
        emitSearchEvent(){
            if(this.isSelect){
                this.$emit('searchInfo', {
                        searchColumn: this.selectColumn,
                        searchContent: this.selectValue,
                        searchInstantly:true,
                 })
            }else{
                this.$emit('searchInfo', {
                    searchColumn: this.selectColumn,
                    searchContent: this.inputValue,
                    searchInstantly:true,
               })
            }
        },
        clearSearchEvent(){
            this.selectColumn="";
            this.selectValue="";
            this.inputValue="";
            this.$emit('searchInfo', {
                    searchColumn: "",
                    searchContent: "",
                    searchInstantly:true,
                })            
        },        
    },
    computed: {},
    watch: {
        selectColumn(nval, oval) {
            this.isSelect = this.isSelectCom[nval];
            if (nval != oval) {
                // 清空搜索栏属性
                this.inputValue = "";
                this.selectValue = "";
            }
        },
        // Needs to be modified!
        inputValue(val) {
            if (val != '') this.$emit('searchInfo', {
                searchColumn: this.selectColumn,
                searchContent: val,
                searchInstantly:false,
            })
        },
        selectValue(val) {
            if (val != '') this.$emit('searchInfo', {
                searchColumn: this.selectColumn,
                searchContent: val,
                searchInstantly:false,
            })
        }

    },
    mounted() {},
    created() {}
}
</script>

<style scoped>
@import "../../assets/css/fontawasome/css/all.min.css";
</style>
