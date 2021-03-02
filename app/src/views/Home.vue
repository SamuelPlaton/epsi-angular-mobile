<template>
  <div>
    <p>Hey</p>
    <pre>{{services}}</pre>
  </div>
</template>

<script>
import Api from "../api/Api";
import {ServiceList} from "../components/list";
import axios from "axios";

export default {
  name: "Home",
  components: {ServiceList},
  data() {
    return {
      services: [],
    };
  },
  async beforeCreate() {
    console.log('hey');
    await axios
        .get("http://172.16.18.11:3001/services/1", {
              headers:{
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
              }
            }
        )
        .then(res => {
          console.log(res.data);
          //this.countries = res.data;
        });
    //const sectors: Array<Sector> = Api.SectorsApi.get();
    //console.log(sectors);
    //this.services = Api.ServicesApi.recommended(sectors.map(s => s.id), '47.208642, -1.546095', 100);
  }
};
</script>
