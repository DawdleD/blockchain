<template>
    <div class="footer">
        <img class="logo" src="../../assets/image/logo-bcs.png" alt="logo">
        <p>Copyright © 2019 BlockChainStudy. All Rights Reserved.</p>
        <p>支持单位 |主办单位：东华大学 |技术支持：东华大学 |举办地点：东华大学</p>
        <p>联系我们 |地址：上海市松江区人民北路2999号 201620 |延安路校区：上海市延安西路1882号 200051</p>
        <p>电话：12345678901 |email：BlockChainStudy@web.com |商务合作</p>
    </div>
</template>

<script>
    export default {
        name: "Footer"
    }
</script>

<style scoped>
    .footer {
        padding-top: 40px;
        height: 245px;
        box-sizing: border-box;
        text-align: center;
        position: absolute;
        bottom: 0;
        width: 100%;
        left: 0;
        background: #444547;
        font-size: 12px;
        display: block;
        overflow: hidden;
    }

    .footer p, .footer a {
        color: #777;
        line-height: 24px
    }

    .footer a:hover {
        text-decoration: underline
    }

    .footer .logo {
        height: 42px;
        width: 42px;
    }
</style>
