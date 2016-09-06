<?php
/* @var $ctrl \bbn\mvc */
echo $ctrl->set_title("Error logs Analysis v2")
          ->add_js(\bbn\x::merge_arrays($ctrl->get_model(), ['root' => $ctrl->say_dir().'/']))
          ->get_view();