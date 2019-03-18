<template>
  <code class="preformatted">

    {{code}}

  </code>
</template>

<style>
.preformatted {
  /* font-family: monospace; */
  white-space: pre;
}
</style>


<script>
import {TemplateRender} from '../assets/template/compiler.js'
// import { LiteGUI } from "../assets/js/litegui.js";
export default {
  props: {
    graph:Object
  },
  data() {
    return {
      code: "",
      // graph: this.graph
    };
  },
  mounted() {
    // res =TemplateRender(this.graph)
    if(this.graph){
      this.code = TemplateRender(this.graph);
    }
    
  }
};
</script>
