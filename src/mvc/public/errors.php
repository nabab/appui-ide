<?php
/* @var $this \bbn\mvc */
echo $this->set_title("Error logs Analysis v2")
          ->add_js(\bbn\x::merge_arrays($this->get_model(), ['root' => $this->say_dir().'/']))
          ->get_view();