<?php
/*
 * Describe what it does!
 *
 * @var $ctrl bbn\Mvc\Controller
 *
 */
$pcs =
  PhpCsFixer\Config::create()
  ->setRules([
    '@PSR2' => true,
    'strict_param' => false,
    'array_syntax' => ['syntax' => 'short'],
    'braces' => [
      'allow_single_line_closure' => false,
      'position_after_functions_and_oop_constructs' => 'next'],
  ])
  ->setIndent('  ');
var_dump(get_class_methods($pcs), $pcs->getRules());