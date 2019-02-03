<template>
    <div class="coba">
        <v-container grid-list-md fill-height>
            <v-layout wrap align-center>
                <v-flex xs3 v-for="i in 4" :key="`a${i}`" hidden-xs-only>
                    <v-card color="primary" class="elevation-15">
                        <v-card-text>
                            waddaps
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs4 v-for="i in 3" :key="`x${i}`" >
                    <v-card color="warning">
                        <v-card-text>
                            waddap
                        </v-card-text>
                    </v-card>
                </v-flex>
                <!-- <v-flex>
                    Hello I am center to vertically using "align-center".
                </v-flex> -->
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    export default {
        data: () => ({
            // drawer: null
        }),
        props: {
            // source: String
        }
    }
</script>

<style lang="scss" scoped>
    .coba{
        height: 100vh;
    }
</style>
