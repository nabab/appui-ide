<?php
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\InputStream;

// Make sure composer dependencies have been installed
require __DIR__ . '/vendor/autoload.php';

class JsonRPC implements MessageComponentInterface {
  protected $clients;
  protected $processes;
  protected $stream;
  private $binary;
  private array $messages_count;
  
  public function __construct($binary) {
    
    // delete all files with tmp extension
    $files = glob(__DIR__ . '/*.tmp');
    foreach ($files as $file) {
      if (is_file($file)) {
        unlink($file);
      }
    }
    
    $this->clients = new \SplObjectStorage;
    $this->processes = [];
    $this->stream = [];
    $this->binary = $binary;
    $this->messages_count = [];
  }
  
  public function onOpen(ConnectionInterface $conn) {
    echo "onOpen\n";
    $command = $this->binary;
    $process = new Process([$command, '--stdio']);
  
    $input = new InputStream();
    
    $process->run(function ($type, $buffer) {
      echo $buffer;
    });
  
    // Specify the directory where the file should be created (in this case, the current directory)
//    $directory = __DIR__;
  
    // Create the temporary file
//    $tempFile = tempnam($directory, 'tmp');

//    $fileHandle = fopen($tempFile, 'w+');
    
    $this->stream[spl_object_id($conn)] = $input;
    $this->messages_count[spl_object_id($conn)] = 0;
    
    $process->setInput($input);
    
    $process->start();
    
    $this->processes[spl_object_id($conn)] = $process;
    echo $process->getPid() . "\n";
    $this->clients->attach($conn);
  }
  
  public function removeContentLengthHeaders($str) {
    $delimiter = "Content-Length: ";
    $parts = explode($delimiter, $str);
    
    // The first part may not be a valid JSON-RPC message if the string starts with "Content-Length:"
    if ($parts[0] === "") {
      array_shift($parts);
    }
    
    $messages = [];
    foreach ($parts as $part) {
      // Find the position of the first "\r\n\r\n" (if any) and get the substring after it
      $headerBodySeparator = "\r\n\r\n";
      $separatorPos = strpos($part, $headerBodySeparator);
      if ($separatorPos !== false) {
        $messages[] = substr($part, $separatorPos + strlen($headerBodySeparator));
      } else {
        // If no "\r\n\r\n" is found, then the whole part is considered a message
        $messages[] = $part;
      }
    }
    
    return $messages;
  }
  
  public function onMessage(ConnectionInterface $from, $msg) {
    $process = $this->processes[spl_object_id($from)];
    $stream = $this->stream[spl_object_id($from)];
    
    // append crlf to msg
    // get msg length and add Content-Length header to the message
    $msg = "Content-Length: " . strlen($msg) . "\r\n\r\n" . $msg;
    echo "\nInput: \n" . $msg;
    
    // echo the text with withspaces caracters
    // flush the output buffer
    $stream->write($msg);
    $this->messages_count[spl_object_id($from)]++;
    // Check for new output in a loop, until the process has terminated
    $wait_max = 100;
    while ($process->isRunning() && $wait_max > 0) {
      // Fetch the incremental output
      $output = $process->getIncrementalOutput();
      if ($output) {
        break;
      }
      
      
      // Fetch any error output
      $errorOutput = $process->getErrorOutput();
      if ($errorOutput) {
        echo "$errorOutput";
      }
      
      $wait_max--;
      // Sleep for a short period of time before checking again
      usleep(100000); // 100000 microseconds = 0.1 seconds
    }
    
    if (!empty($output)) {
      $test=  $this->removeContentLengthHeaders($output);
      echo "\nOutput:\n $output";
      foreach ($test as $message) {
        $from->send($message);
      }
    }
  
    $errorOutput = $process->getErrorOutput();
    if ($errorOutput) {
      echo "$errorOutput";
    }
  }
  
  public function onClose(ConnectionInterface $conn) {
    echo "onClose\n";
    $this->clients->detach($conn);
    $this->processes[spl_object_id($conn)]->stop();
    $stream = $this->stream[spl_object_id($conn)];
    $stream->close();
    unset($this->stream[spl_object_id($conn)]);
    unset($this->processes[spl_object_id($conn)]);
  }
  
  public function onError(ConnectionInterface $conn, \Exception $e) {
    $conn->close();
  }
}



//$loop   = React\EventLoop\Factory::create();
/*$webSock = new React\Socket\SecureServer(
    new React\Socket\Server('0.0.0.0:8080', $loop),
    $loop,
    [
        'local_cert'        => '../public.pem', // path to your cert
        'local_pk'          => '../private.pem', // path to your server private key
        'allow_self_signed' => FALSE, // Allow self signed if you don't have a paid SSL
        'verify_peer' => FALSE
    ]
);*/

$app = new Ratchet\App('localhost', 11001, '0.0.0.0'); // the last parameter is the react event loop
$app->route('/php', new JsonRPC('./intelephense'), array('*'));
$app->route('/less', new JsonRPC('./css-languageserver'), array('*'));

// ruinning the Ratchet application through $webSock
//$webSock->on('connection', function($conn) use ($app) {
  //  $app->run();
//});
$app->run();

