<!-- HTML Document -->

<?php
/* Static classes xx and st are available as aliases of bbn\X and bbn\Str respectively */
?>

<bbn-input v-model="src"
           placeholder="src"/>
<bbn-input v-model="dest"
           placeholder="dest"/>
<bbn-input v-model="name"
           placeholder="name"/>
<bbn-button @click="copy"/>
