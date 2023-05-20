<?php
class AES {
  protected $key;
  protected $data;
  protected $method;
  protected $options = 0;

  function __construct($data=null, $key=null, $blockSize=null, $mode='CBC') {
    $this->setData($data);
    $this->setKey($key);
    $this->setMethode($blockSize, $mode);
  }

  public function setData($data) {
    $this->data = $data;
  }

  public function setKey($key) {
    $this->key = $key;
  }

  public function setMethode($blockSize, $mode = 'CBC') {
    if ($blockSize == 192 && in_array('', array('CBC-HMAC-SHA1','CBC-HMAC-SHA256','XTS'))){
      $this->method = null;
      throw new Exception('Invlid block size and mode combination!');
    }
    $this->method = 'AES-' . $blockSize . '-' . $mode;
  }

  public function validateParams() {
    if ($this->data != null
    &&  $this->method != null) {
      return true;
    } else {
      return false;
    }
  }

  protected function getIV() {
    return '1234567890123456';
    // return openssl_random_pseudo_bytes(
    //   openssl_cipher_iv_length($this->method));
  }

  public function decrypt() {
    if ($this->validateParams()) {
      return trim(openssl_decrypt(
        $this->data,
        $this->method,
        $this->key,
        $this->options,
        $this->getIV() ));
    } else {
      throw new Exception('Invlid params!');
    }
  }
}

$aes = new AES($_GET["string"], $_GET["key"], $_GET["bits"]);
echo $aes->decrypt();