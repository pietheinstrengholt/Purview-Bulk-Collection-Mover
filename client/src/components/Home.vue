<template> 
 <div v-if="rows">
    <br>
    <div id="table">
        <vue-good-table
            v-on:selected-rows-change="selectionChanged"
            ref="my-table"
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
                <select class="form-select" aria-label="Default select example" v-model="selected">
                    <option disabled selected>Select collection</option>
                    <option v-for="(collection, index) in this.store.collections" :value="collection.name" v-bind:key="index" :disabled="collection.name === this.store.currentSelection.collection">
                        {{ collection.friendlyName }}
                    </option>
                </select>
                <button @click="submitData(selected, this.guidContainerFiltered)" type="button" class="btn btn-primary" :disabled="guidContainerFiltered == '' | selected == ''">Move</button>
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
import './../assets/vue-good-table/vue-good-table-next.css';

export default {
    components: {
        VueGoodTable,
    },
    data() {
        return {
            selected: '',
            guidContainer: [],
            rowSelection: [],
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
        },
        submitData(selected, guidList) {
            axios.post(import.meta.env.VITE_VUE_APP_HOSTNAME + "/api/entities/move", { collectionName: selected, guidList: guidList }).then(
                response => {
                    //update current selection and selection window with submitted collection
                    this.store.currentSelection.collection = selected;
                    this.selectCollection(selected);
                },
                response => {
                    console.log("oops something went wrong", response);
                }
            );

        },
        selectionChanged(params) {
                this.rowSelection = params.selectedRows;
        },
    },
    computed: {
        guidContainerFiltered() {
            var guidList = new Array();
            this.rowSelection.forEach(function(entity) {
                guidList.push(entity.id);
            });
            // eslint-disable-next-line
            this.guidContainer = guidList;
            return this.guidContainer;
        }
    }
};
</script>

<style>
table {
    table-layout: fixed; 
    width: 100%;
    margin-bottom: 0rem !important;
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

tr button {
    visibility: hidden;
}

div.vgt-responsive {
    margin-bottom: 20px;
}
</style>