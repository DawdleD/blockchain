<template>
    <!--课程分类 S-->
    <div class="course-header">
        <!--课程体系 S-->
        <div class="course-system">
            <ul>
                <li>
                    <a>
                        <span class="system-name">全部课程</span>
                    </a>
                </li>
                <li>
                    <a>
                        <span class="system-name current">区块链</span>
                    </a>
                </li>
                <li>
                    <a>
                        <span class="system-name">以太坊编程</span>
                    </a>
                </li>
                <li>
                    <a>
                        <span class="system-name">比特币编程</span>
                    </a>
                </li>
                <li>
                    <a>
                        <span class="system-name">数据库安全</span>
                    </a>
                </li>
                <li>
                    <a>
                        <span class="system-name">系统安全</span>
                    </a>
                </li>
            </ul>
        </div>
        <!--课程体系 E-->
        <!--课程类别 S-->
        <div class="course-type">
            <ul>
                <li>
                    <a><span class="current">全部</span></a>
                </li>
                <li>
                    <a><span>以太坊</span></a>
                </li>
                <li>
                    <a><span>智能合约</span></a>
                </li>
                <li>
                    <a><span>DAPP全栈</span></a>
                </li>
            </ul>
        </div>
        <!--课程类别 E-->
    </div>
    <!--课程分类 E-->
</template>

<script>
    export default {
        name: "ListHeader",
        props: {
            systemType: {type: Object, require: true}
        }
    }
</script>

<style src="../../assets/css/course-list.css"></style>

