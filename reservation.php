<?php
http_response_code(410);
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['success' => false, 'message' => 'Please call Mama Rosa at 647-345-1995 for orders and table enquiries.']);
