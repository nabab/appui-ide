<?php
/* @var $this \bbn\mvc */
echo $this->set_title("Error logs Analysis")
  ->add_js(\bbn\tools::merge_arrays($this->get_model(), ['root' => $this->say_dir().'/']))
  ->get_view();