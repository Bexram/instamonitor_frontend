<template>
    <div id="appMain">
        <v-app-bar>
            <img class="d-flex align-start mb-6"
                 src="../assets/logo.png" alt="creatum">
            <h1 class="d-flex align-start mb-6"
            >Мониторинг продвижения аккаунтов Instagram</h1>

                <v-btn class="d-flex align-end mb-6"
                        color="primary"
                        fab
                        small
                        dark
                >
                    <v-icon>mdi-account-circle</v-icon>
                </v-btn>
        </v-app-bar>
        <v-app id="inspire">
            <v-container fluid>
                <v-dialog
                        v-model="updatingerror"
                        width="200"
                        hide-overlay
                        transition="dialog-bottom-transition"
                >
                    <v-alert
                            color="orange"
                            type="warning"
                            dismissible
                    >Произошла ошибка!
                        Попробуйте позже
                    </v-alert>

                </v-dialog>
                <v-data-iterator
                        :items="monitors"
                        :items-per-page.sync="itemsPerPage"
                        :page.sync="page"
                        :search="search"
                        :sort-by="sortBy.toLowerCase()"
                        :sort-desc="sortDesc"
                        hide-default-footer
                >
                    <template v-slot:header>
                        <v-toolbar
                                dark
                                color="blue darken-3"
                                class="mb-1"
                        >
                            <v-text-field
                                    v-model="search"
                                    clearable
                                    flat
                                    solo-inverted
                                    hide-details
                                    prepend-inner-icon="mdi-magnify"
                                    label="Search"
                            ></v-text-field>
                            <template v-if="$vuetify.breakpoint.mdAndUp">
                                <v-spacer></v-spacer>
                                <v-select
                                        v-model="sortBy"
                                        flat
                                        solo-inverted
                                        hide-details
                                        :items="keys"
                                        prepend-inner-icon="mdi-magnify"
                                        label="Sort by"
                                ></v-select>
                                <v-spacer></v-spacer>
                                <v-btn-toggle
                                        v-model="sortDesc"
                                        mandatory
                                >
                                    <v-btn v-on:click="upData()"
                                           v-if="!updating"
                                           large
                                           depressed
                                           color="blue"

                                    >Обновить данные
                                    </v-btn>
                                    <v-btn v-if="updating"
                                           large
                                           depressed
                                           color="blue"
                                           loading
                                    ></v-btn>


                                    <v-btn
                                            large
                                            depressed
                                            color="blue"
                                            :value="false"
                                    >
                                        <v-icon>mdi-arrow-up</v-icon>
                                    </v-btn>
                                    <v-btn
                                            large
                                            depressed
                                            color="blue"
                                            :value="true"
                                    >
                                        <v-icon>mdi-arrow-down</v-icon>
                                    </v-btn>
                                </v-btn-toggle>
                            </template>
                        </v-toolbar>
                    </template>

                    <template v-slot:default="props">
                        <v-row>
                            <v-col
                                    v-for="item in props.items"
                                    :key="item.name"
                                    cols="12"
                                    sm="6"
                                    md="4"
                                    lg="3"
                            >
                                <v-card>
                                    <v-card-title class="subheading font-weight-bold">
                                        {{ item.name }}
                                    </v-card-title>

                                    <v-divider></v-divider>

                                    <v-list dense>
                                        <v-list-item
                                                v-for="(key, index) in filteredKeys"
                                                :key="index"
                                        >
                                            <v-list-item-content :class="{ 'blue--text': sortBy === key }">
                                                {{ key }}:
                                            </v-list-item-content>
                                            <v-list-item-content
                                                    class="align-end"
                                                    :class="{ 'blue--text': sortBy === key }"
                                            >
                                                {{ item[key.toLowerCase()] }}
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-card>
                            </v-col>
                        </v-row>
                    </template>

                    <template v-slot:footer>
                        <v-row
                                class="mt-2"
                                align="center"
                                justify="center"
                        >
                            <span class="grey--text">Items per page</span>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on, attrs }">

                                    <v-btn
                                            dark
                                            text
                                            color="primary"
                                            class="ml-2"
                                            v-bind="attrs"
                                            v-on="on"
                                    >
                                        {{ itemsPerPage }}
                                        <v-icon>mdi-chevron-down</v-icon>
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item
                                            v-for="(number, index) in itemsPerPageArray"
                                            :key="index"
                                            @click="updateItemsPerPage(number)"
                                    >
                                        <v-list-item-title>{{ number }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>

                            <v-spacer></v-spacer>

                            <span
                                    class="mr-4
              grey--text"
                            >
              Page {{ page }} of {{ numberOfPages }}
            </span>
                            <v-btn
                                    fab
                                    dark
                                    color="blue darken-3"
                                    class="mr-1"
                                    @click="formerPage"
                            >
                                <v-icon>mdi-chevron-left</v-icon>
                            </v-btn>
                            <v-btn
                                    fab
                                    dark
                                    color="blue darken-3"
                                    class="ml-1"
                                    @click="nextPage"
                            >
                                <v-icon>mdi-chevron-right</v-icon>
                            </v-btn>
                        </v-row>
                    </template>
                </v-data-iterator>
            </v-container>
        </v-app>
        <v-footer app>
            <!-- -->
        </v-footer>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: 'mainApp',
        props: {
            msg: String
        },
        data() {
            return {
                updatingerror: false,
                updating: false,
                itemsPerPageArray: [4, 8, 12],
                search: '',
                filter: {},
                sortDesc: false,
                page: 1,
                itemsPerPage: 4,
                sortBy: 'name',
                keys: [
                    'name',
                    'ER',
                    'Followers',
                    'Target',
                    'Recomendation',
                ],

            }
        },
        mounted() {
            this.$store.dispatch('Backend/GET_MONITORS')
        },
        computed: {
            ...mapGetters('Backend', {
                monitors: 'MONITORS',
            }),
            numberOfPages() {
                return Math.ceil(this.monitors.length / this.itemsPerPage)
            },
            filteredKeys() {
                return this.keys.filter(key => key !== 'Name')
            },
        },
        methods: {
            upData() {
                this.updating = true;
                this.$store.dispatch('Backend/UPDATE_DATA').then((response) => {
                    if (response.status !== 204) {
                        this.updatingerror = true;
                        this.updating = false;
                    } else {
                        this.updatingerror = false;
                        this.updating = false;
                    }

                })
            },
            nextPage() {
                if (this.page + 1 <= this.numberOfPages) this.page += 1
            },
            formerPage() {
                if (this.page - 1 >= 1) this.page -= 1
            },
            updateItemsPerPage(number) {
                this.itemsPerPage = number
            },
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .admin {
        margin-right: 10px;
    }

    header {
        overflow: hidden
    }

    h3 {
        margin: 40px 0 0;
    }

    h1 {
        margin-left: 50px;
        font-family: Roboto;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
