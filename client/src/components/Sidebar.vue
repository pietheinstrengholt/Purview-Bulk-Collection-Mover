<template>
    <div>
        <br>
        <h3>Collections:</h3>
        <ul class="list-group">
            <li v-for="(collection, index) in this.store.collections" v-bind:key="index" class="list-group-item" v-on:click="selectCollection(collection.name)" v-bind:id="collection.name" v-bind:class="{'active': store.currentSelection.collection == collection.name}">
                <div v-if="collection.parentCollection">
                    {{ lookupCollectionName(collection.parentCollection.referenceName) }} - 
                </div>
                <div>
                    {{ collection.friendlyName }}
                </div> 
            </li>
        </ul>
    </div>
</template>
  
<script>
import axios from 'axios';
import store from "../store";

export default {
    data() {
        return {
            store: store,
            collections: {}
        }
    },
    created: async function() {
        axios
        .get(import.meta.env.VITE_VUE_APP_HOSTNAME + "/api/collections")
        .then(response => {
            return response;
        })
        .then(response => {
            this.store.collections = response.data.sort(
                            (A, B) => A.friendlyName - B.parentCollection,
                        )
        });
    },
    methods: {
        selectCollection(name) {
            this.store.currentSelection.collection = name;
        },
        lookupCollectionName(name) {
            var result = this.store.collections.find(o => o.name === 'purviewphs');
            if (result) {
                return result.friendlyName;    
            }
        }
    }
};
</script>