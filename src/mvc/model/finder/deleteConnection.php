<?php
/**
 * What is my purpose?
 *
 **/

/** @var $model \bbn\Mvc\Model*/

if (isset($model->data['id'])) {
  return [
    'success' => $model->db->delete('bbn_users_options', [
      'id' => $model->data['id'],
    ]),
  ];
}