<?php
/**
 * Created by BBN Solutions.
 * User: Vito Fava
 * Date: 11/12/17
 * Time: 16.41
 */

$ctrl->obj = $ctrl->add_data([
  'repository' => $ctrl->post['data']['repository'],
  'path' => $ctrl->post['data']['path']
])->get_model('./all');

