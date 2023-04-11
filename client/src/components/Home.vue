<template>
 <div v-if="discoverData">
    <table class="table">
    <thead>
        <tr>
            <th scope="col">qualifiedName</th>
            <th scope="col">entityType</th>
            <th scope="col">name</th>
            <th scope="col">id</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(item, index) in discoverData" v-bind:key="index">
            <td>{{ item.qualifiedName }}</td>
            <td>{{ item.entityType }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.id }}</td>
        </tr>
    </tbody>
    </table>
 </div>
</template>

<script>
import axios from 'axios';
import store from "../store";

export default {
    data() {
        return {
            discoverData: '',
            store: store
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
                    //this.discoverData = this.sortByKey(response.data, "entityType");
                    this.discoverData = response.data.sort(
                            (teamA, teamB) => teamA.qualifiedName - teamB.entityType,
                        )
                },
                response => {
                    console.log("oops something went wrong", response);
                }
            );
        },
        sortByKey(array, key) {
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
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