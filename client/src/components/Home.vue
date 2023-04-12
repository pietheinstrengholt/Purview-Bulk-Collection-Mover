<template> 
 <div v-if="rows">
    <vue-good-table
        :columns="columns"
        :rows="rows"
        styleClass="table condensed">
    </vue-good-table>
 </div>
</template>

<script>
import axios from 'axios';
import store from "../store";
import { VueGoodTable } from 'vue-good-table-next';

export default {
    components: {
        VueGoodTable,
    },
    data() {
        return {
            discoverData: '',
            store: store,
            columns: [
                {
                    label: 'qualifiedName',
                    field: 'qualifiedName',
                },
                {
                    label: 'entityType',
                    field: 'entityType',
                },
                {
                    label: 'name',
                    field: 'name'
                },
                {
                    label: 'id',
                    field: 'id',
                },
            ],
            rows: null
        }
    },
    watch: {
        "store.currentSelection.collection": {
            handler: function(data) {
                this.selectCollection(data);
            }
        }
    },
    methods: {
        selectCollection(name) {
            axios.post(import.meta.env.VITE_VUE_APP_HOSTNAME + "/api/collections/discover", { collectionName: name }).then(
                response => {
                    this.rows = response.data.sort(
                            (A, B) => A.qualifiedName - B.entityType,
                        );
                },
                response => {
                    console.log("oops something went wrong", response);
                }
            );
        }
    }
};
</script>

<style scoped>
table {
    table-layout: fixed; 
    width: 100%;
}
th, td {
  border: 1px solid;
  word-wrap: break-word;
}
</style>