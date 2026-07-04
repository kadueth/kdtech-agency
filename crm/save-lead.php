<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$data = json_decode(file_get_contents('php://input'), true);
if (!$data || empty($data['nome']) || empty($data['email'])) {
    echo json_encode(['success' => false, 'error' => 'Dados inválidos']);
    exit;
}

$file = __DIR__ . '/leads.json';
$leads = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

$origem = 'Manual';
if (!empty($data['source'])) {
    if (strpos($data['source'], '/en/') !== false || strpos($data['source'], '.com.au') !== false) {
        $origem = 'Austrália';
    } else {
        $origem = 'Brasil';
    }
}

$lead = [
    'id'       => uniqid('', true),
    'nome'     => htmlspecialchars($data['nome'], ENT_QUOTES),
    'empresa'  => htmlspecialchars($data['empresa'] ?? '', ENT_QUOTES),
    'email'    => filter_var($data['email'], FILTER_SANITIZE_EMAIL),
    'telefone' => htmlspecialchars($data['telefone'] ?? '', ENT_QUOTES),
    'servico'  => htmlspecialchars($data['servico'] ?? '', ENT_QUOTES),
    'mensagem' => htmlspecialchars($data['mensagem'] ?? '', ENT_QUOTES),
    'status'   => 'Novo',
    'origem'   => $origem,
    'data'     => date('c'),
    'notas'    => '',
    'source'   => $data['source'] ?? '',
];

$leads[] = $lead;
file_put_contents($file, json_encode($leads, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// Optional: notify via email
$to = 'contato@kdtech.com.br';
$subject = "Novo Lead KDTech – {$lead['nome']}";
$body = "Nome: {$lead['nome']}\nEmpresa: {$lead['empresa']}\nEmail: {$lead['email']}\nTelefone: {$lead['telefone']}\nServiço: {$lead['servico']}\nOrigem: {$origem}\nMensagem: {$lead['mensagem']}";
@mail($to, $subject, $body, "From: noreply@kdtech.com.br\r\nContent-Type: text/plain; charset=utf-8");

echo json_encode(['success' => true, 'id' => $lead['id']]);
