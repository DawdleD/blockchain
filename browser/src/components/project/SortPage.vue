<template>
    <!--分页 S-->
    <div class="sort-page" v-if="parseInt(pageIndex)<=parseInt(pageSum)">
        <router-link :class="{'page-prev-btn':true,'page-btn-dis':preBtn}"
                     :to="{path:preBtnUrl}"><i class="fas fa-chevron-left"></i>
        </router-link>
        <router-link :class="{'page-btn':true,'page-btn-cur':pageShow[0].cur}"
                     v-if="pageShow[0].show"
                     :to="{path:pageShow[0].url}">{{pageShow[0].number}}
        </router-link>
        <router-link :class="{'page-btn':true,'page-btn-cur':pageShow[1].cur}"
                     v-if="pageShow[1].show"
                     :to="{path:pageShow[1].url}">{{pageShow[1].number}}
        </router-link>
        <span v-if="needDotPre">...</span>
        <router-link :class="{'page-btn':true,'page-btn-cur':pageShow[2].cur}"
                     v-if="pageShow[2].show"
                     :to="{path:pageShow[2].url}">{{pageShow[2].number}}
        </router-link>
        <router-link :class="{'page-btn':true,'page-btn-cur':pageShow[3].cur}"
                     v-if="pageShow[3].show"
                     :to="{path:pageShow[3].url}">{{pageShow[3].number}}
        </router-link>
        <router-link :class="{'page-btn':true,'page-btn-cur':pageShow[4].cur}"
                     v-if="pageShow[4].show"
                     :to="{path:pageShow[4].url}">{{pageShow[4].number}}
        </router-link>
        <span v-if="needDotNext">...</span>
        <router-link :class="{'page-btn':true,'page-btn-cur':pageShow[5].cur}"
                     v-if="pageShow[5].show"
                     :to="{path:pageShow[5].url}">{{pageShow[5].number}}
        </router-link>
        <router-link :class="{'page-btn':true,'page-btn-cur':pageShow[6].cur}"
                     v-if="pageShow[6].show"
                     :to="{path:pageShow[6].url}">{{pageShow[6].number}}
        </router-link>
        <router-link :class="{'page-prev-btn':true,'page-btn-dis':nextBtn}"
                     :to="{path:nextBtnUrl}"><i class="fas fa-chevron-right"></i>
        </router-link>
    </div>
    <!--分页 E-->
</template>

<script>
    export default {
        name: "SortPage",
        data() {
            return {
                pageSum: 1,
                pageIndex: 0,  //当前页数
                pageShow: [  //展示出来的按钮
                    {number: 1, show: false, cur: false, url: ''},
                    {number: 0, show: false, cur: false, url: ''},
                    {number: 0, show: false, cur: false, url: ''},
                    {number: 0, show: false, cur: false, url: ''},
                    {number: 0, show: false, cur: false, url: ''},
                    {number: 0, show: false, cur: false, url: ''},
                    {number: 0, show: false, cur: false, url: ''},
                ],
                pageUrl: '',  //url
                needDotPre: false, //是否需要...
                needDotNext: false, //是否需要...
                preBtn: false,  //前一页按钮是否可点击
                preBtnUrl: '',
                nextBtn: false,  //后一页按钮
                nextBtnUrl: '',
            }
        },
        props: {
            page: {type: Object, require: true}
        },
        methods: {
            //页数大于7
            sortPageMax() {
                let pageSum = parseInt(this.pageSum), pageIndex = parseInt(this.pageIndex);
                /**
                 *  1，2
                 *  pageSum，pageSum-1
                 */
                this.pageShow[0] = {number: 1, show: true, cur: false, url: `${this.pageUrl}page=1`};
                this.pageShow[1] = {number: 2, show: true, cur: false, url: `${this.pageUrl}page=2`};
                this.pageShow[5] = {
                    number: pageSum - 1,
                    show: true,
                    cur: false,
                    url: `${this.pageUrl}page=${pageSum - 1}`
                };
                this.pageShow[6] = {
                    number: pageSum,
                    show: true,
                    cur: false,
                    url: `${this.pageUrl}page=${pageSum}`
                };
                /**
                 * 页码
                 * 5 <= pageIndex <= pageSum-4
                 */
                if (4 < pageIndex && pageIndex < pageSum - 3) {
                    this.needDotPre = true;
                    this.pageShow[2] = {
                        number: pageIndex - 1,
                        show: true,
                        cur: false,
                        url: `${this.pageUrl}page=${pageIndex - 1}`
                    };
                    this.pageShow[3] = {
                        number: pageIndex,
                        show: true,
                        cur: true,
                        url: `${this.pageUrl}page=${pageIndex}`
                    };
                    this.pageShow[4] = {
                        number: pageIndex + 1,
                        show: true,
                        cur: false,
                        url: `${this.pageUrl}page=${pageIndex + 1}`
                    };
                    this.needDotNext = true;
                }
                /**
                 * 页码
                 * 1-4
                 */
                else if (pageIndex <= 4) {
                    this.needDotPre = false;
                    this.needDotNext = true;
                    switch (pageIndex) {
                        case 4:
                            this.pageShow[2] = {number: 3, show: true, cur: false, url: `${this.pageUrl}page=3`};
                            this.pageShow[3] = {number: 4, show: true, cur: true, url: `${this.pageUrl}page=4`};
                            this.pageShow[4] = {number: 5, show: true, cur: false, url: `${this.pageUrl}page=5`};
                            break;
                        case 3:
                            this.pageShow[2].show = false;
                            this.pageShow[3] = {number: 3, show: true, cur: true, url: `${this.pageUrl}page=3`};
                            this.pageShow[4] = {number: 4, show: true, cur: false, url: `${this.pageUrl}page=4`};
                            break;
                        case 2:
                            this.pageShow[1].cur = true;
                            this.pageShow[2].show = false;
                            this.pageShow[3].show = false;
                            this.pageShow[4] = {number: 3, show: true, cur: false, url: `${this.pageUrl}page=3`};
                            break;
                        case 1:
                            this.pageShow[0].cur = true;
                            this.pageShow[2].show = false;
                            this.pageShow[3].show = false;
                            this.pageShow[4].show = false;
                            break;
                    }
                }
                /**
                 * 页码
                 * pageAll-3 --- pageAll
                 */
                else {
                    this.needDotPre = true;
                    this.needDotNext = false;
                    switch (pageSum - pageIndex) {
                        case 3:
                            this.pageShow[2] = {
                                number: pageSum - 4,
                                show: true,
                                cur: false,
                                url: `${this.pageUrl}page=${pageSum - 4}`
                            };
                            this.pageShow[3] = {
                                number: pageSum - 3,
                                show: true,
                                cur: true,
                                url: `${this.pageUrl}page=${pageSum - 3}`
                            };
                            this.pageShow[4] = {
                                number: pageSum - 2,
                                show: true,
                                cur: false,
                                url: `${this.pageUrl}page=${pageSum - 2}`
                            };
                            break;
                        case 2:
                            this.pageShow[2].show = false;
                            this.pageShow[3] = {
                                number: pageSum - 3,
                                show: true,
                                cur: false,
                                url: `${this.pageUrl}page=${pageSum - 3}`
                            };
                            this.pageShow[4] = {
                                number: pageSum - 2,
                                show: true,
                                cur: true,
                                url: `${this.pageUrl}page=${pageSum - 2}`
                            };
                            break;
                        case 1:
                            this.pageShow[2].show = false;
                            this.pageShow[3].show = false;
                            this.pageShow[4] = {
                                number: pageSum - 2,
                                show: true,
                                url: `${this.pageUrl}page=${pageSum - 2}`
                            };
                            this.pageShow[5].cur = true;
                            break;
                        case 0:
                            this.pageShow[2].show = false;
                            this.pageShow[3].show = false;
                            this.pageShow[4].show = false;
                            this.pageShow[6].cur = true;
                    }
                }
            },
            //页数小于7
            sortPageMin() {
                let pageSum = parseInt(this.pageSum), pageIndex = parseInt(this.pageIndex);
                this.pageShow[0].show = true;
                this.pageShow[0].url = `${this.pageUrl}page=1`;
                this.pageShow[1] = {number: 2, show: (pageSum > 1), cur: false, url: `${this.pageUrl}page=2`};
                this.needDotPre = (pageIndex - 1 > 3);
                if (pageSum > 4)
                    this.pageShow[2] = {
                        number: 3,
                        show: (pageIndex === 2 || pageIndex === 3 || pageIndex === 4),
                        cur: false,
                        url: `${this.pageUrl}page=3`
                    };
                if (pageSum > 5)
                    this.pageShow[3] = {
                        number: 4,
                        show: (pageIndex === 3 || pageIndex === 4 || pageIndex === 5),
                        cur: false,
                        url: `${this.pageUrl}page=4`
                    };
                if (pageSum > 6)
                    this.pageShow[4] = {
                        number: 5,
                        show: (pageIndex === 4 || pageIndex === 5 || pageIndex === 6),
                        cur: false,
                        url: `${this.pageUrl}page=5`
                    };
                this.needDotNext = (pageIndex + 1 < pageSum - 2);
                this.pageShow[5] = {
                    number: pageSum - 1,
                    show: pageSum > 3,
                    cur: false,
                    url: `${this.pageUrl}page=${pageSum - 1}`
                };
                this.pageShow[6] = {
                    number: pageSum,
                    show: pageSum > 2,
                    cur: false,
                    url: `${this.pageUrl}page=${pageSum}`
                };
                this.pageShow[0].cur = pageIndex === 1;
                if (pageIndex === 2) this.pageShow[1].cur = true;
                else if (pageSum - pageIndex === 0) this.pageShow[6].cur = true;
                else if (pageSum - pageIndex === 1) this.pageShow[5].cur = true;
                else this.pageShow[pageIndex - 1].cur = true;
            },
            //分页
            sortPage() {
                let pageSum = parseInt(this.pageSum), pageIndex = parseInt(this.pageIndex);
                if (pageSum > 7) this.sortPageMax();
                else this.sortPageMin();
                this.preBtnUrl = `${this.pageUrl}page=${pageIndex - 1}`;
                this.nextBtnUrl = `${this.pageUrl}page=${pageIndex + 1}`;
                if (pageIndex === 1 && pageSum !== 1) {
                    this.preBtnUrl = `${this.pageUrl}page=1`;
                    this.preBtn = true;
                    this.nextBtn = false;
                } else if (pageIndex === pageSum && pageSum !== 1) {
                    this.nextBtnUrl = `${this.pageUrl}page=${this.pageIndex}`;
                    this.preBtn = false;
                    this.nextBtn = true;
                } else if (pageSum !== 1) {
                    this.preBtn = false;
                    this.nextBtn = false;
                } else {
                    this.preBtn = true;
                    this.nextBtn = true;
                }
            }
        },
        computed: {
            getPageIndex() {
                return this.$route.query.page === undefined ? 1 : this.$route.query.page;
            },
            getPageUrl() {
                return this.page.pageUrl;
            }
        },
        watch: {
            getPageIndex(val) {
                this.pageIndex = val;
            },
            getPageUrl(val) {
                this.pageUrl = val;
                this.$axios.post(`/api/course/list/count`, {
                    projectField: this.$route.query.projectField,
                    type: this.$route.query.type,
                    filter: this.$route.query.filter,
                    search:this.$route.params.search
                }).then((response) => {
                    if (response.data.status === 1) {
                        const count = response.data['count'];
                        this.pageSum = count % 10 === 0 ? Math.floor(count / 10) : Math.floor(count / 10) + 1;
                        this.sortPage();
                    } else console.log(response.data.message);
                }).catch((err) => {
                    console.log(err);
                });
            },
            pageIndex() {
                this.sortPage();
            }
        },
        created() {
            /* 获取总数，分页需要 */
            this.$axios.post(`/api/course/list/count`, {
                projectField: this.$route.query.projectField,
                type: this.$route.query.type,
                filter: this.$route.query.filter,
                search:this.$route.params.search
            }).then((response) => {
                if (response.data.status === 1) {
                    const count = response.data['count'];
                    this.pageSum = count % 10 === 0 ? Math.floor(count / 10) : Math.floor(count / 10) + 1;
                    this.pageIndex = this.$route.query.page === undefined ? 1 : this.$route.query.page;
                    this.pageUrl = this.page.pageUrl;
                } else console.log(response.data.message);
            }).catch((err) => {
                console.log(err);
            });
        }
    }
</script>

<style src="../../assets/css/course-list.css"></style>

