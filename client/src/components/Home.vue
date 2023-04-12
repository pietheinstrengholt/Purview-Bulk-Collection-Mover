<template> 
 <div v-if="rows">
    <div id="table">
        <vue-good-table
            styleClass="table"
            :columns="columns"
            :rows="rows"
            :select-options="{ enabled: true }"
            :search-options="{ enabled: true }"
            :sort-options="{
                enabled: true,
                multipleColumns: true,
                initialSortBy: [
                    {field: 'qualifiedName', type: 'asc'},
                    {field: 'entityType', type: 'asc'}
                ]
            }"
        >
        <template #table-actions>
            <div class="input-group">
                <select class="form-select" aria-label="Default select example">
                    <option disabled selected>Select collection</option>
                    <option v-for="(collection, index) in this.store.collections" :value="collection.name" v-bind:key="index">
                        {{ collection.friendlyName }}
                    </option>
                </select>
                <button type="button" class="btn btn-primary">Move</button>
            </div>
        </template>
        </vue-good-table>
    </div>
 </div>
</template>

<script>
import axios from 'axios';
import store from "../store";
import { VueGoodTable } from 'vue-good-table-next';
import './../../node_modules/vue-good-table-next/dist/vue-good-table-next.css';

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
                    sortable: true,
                    width: '30%',
                },
                {
                    label: 'entityType',
                    field: 'entityType',
                    sortable: true,
                },
                {
                    label: 'name',
                    field: 'name',
                    sortable: true,
                    width: '20%',
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
                    this.rows = response.data;
                },
                response => {
                    console.log("oops something went wrong", response);
                }
            );
        }
    }
};
</script>

<style>
table {
    table-layout: fixed; 
    width: 100%;
}
th, td {
  border: 1px solid;
  word-wrap: break-word;
}

th.vgt-checkbox-col {
    width: 20px;
}

div.input-group {
    right: 5px;
}
</style>