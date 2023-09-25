<?php

namespace appui\ide;


class Output extends \Symfony\Component\Console\Output\Output
{
  public function __construct()
  {
    parent::__construct(self::VERBOSITY_NORMAL, false, null);
  }

  public function writeln($messages, $options = 0)
  {
    $this->write($messages, true, $options);
  }

  public function write($messages, $newline = false, $options = self::OUTPUT_NORMAL)
  {
    $this->doWrite($messages, $newline);
  }

  protected function doWrite($message, $newline)
  {
    /*\Installer::report($message);
    if ($newline) {
      \Installer::report("\n");
    }*/
  }
}