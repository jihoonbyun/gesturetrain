
  //�� ��ü�� ���Ͼ��̿��� ���� handshake�� �������� Ŭ���̾�Ʈ�� ����
	// ���� ���� Ŭ���̾�Ʈ ���� ����
  // �ڵ����� �������� ��������
module.exports = Config = {	
	
	// key
	gtcc_ENCODING : true, // Ű ���� ���ڵ�(lzw) ����
	gtcc_STORAGE : 'localStorage',// localStorage or cookie. ����� ���丮��. ���ý��丮�� �������ϸ� �ڵ����� ��Ű����
	gtcc_COOKIE_EXP : 365, // ��Ű ��ȿ�Ⱓ. ���ú��� ���� ��(����Ʈ : ��������-����)

	// traffic
	// Ŭ���̾�Ʈ ����ҿ� �����صξ��ٰ� �����ϴ� ��� ����
  // �����ð���� vs �����뷮��� vs �������������	
	// �ǽð� �޴��� Ŭ����������, �ﰢ������ ������, �ƴҰ��� ���ÿ� ������ �ɼǿ� ���� ����
	traffic_OPTION : 'auto',	// auto, time, kb, query, false �� �� 1. �ڵ��ɼ��� ������ �ɼ��� �Ѱ����� �����ϸ� ����
	traffic_TIME  : 3000, // �ð��ϰ��, 3�ʸ���
	traffic_KB : 5, // �뷮����ϰ��, 5kb����. ��Ű������ϰ�� �ִ������
	traffic_QUERY : 100, // ��ġ������ 100�� �̻��� ���(��ġ������, �հ����� �����ٰ� ���� �ѵ��� �̺�Ʈ������ ��Ʈ ��ü)
	

	// monitoring (�������� ������� = false)
	// monitoring -client
	monitor_SOCKET_CLIENT_SLOW : 450, // Ŭ���̾�Ʈ -����io 1ȸ ���ۼӵ��� üũ�Ͽ� �����ӵ� �̻��� �Ǹ� ������ alert
	monitor_SOCKET_CLIENT_REPEAT : 1000, // Ŭ���̾�Ʈ -����io �д� ���۰����� üũ�Ͽ� �������� �̻��̸� alert
	monitor_BROWSER_CLIENT_MEMORY : false,// Ŭ���̾�Ʈ �������� �޸� �����Ͱ� �����κ��̻��̸� ��Ʈ
	monitor_BROWSER_CIENT_LOADING : false,// Ŭ���̾�Ʈ �������� �ε��ӵ�(������)�� �����κ��̻��̸� ��Ʈ
	monitor_GEO_CLIENT_DISTANCE : 100, // km. ���� ���ӽ� ��ġ���� ���� km ���������̸� ������ ��Ʈ

	//monitoring -server
	// ��ü �޴� ���� �������� �Ѵ�
	monitor_SOCKET_SERVER_SLOW  : 9, // ms
	monitor_SOCKET_SERVER_QURIES : 10000, // min  
	monitor_CPU : false,
	monitor_MEMORY : false,

	// visitor
	visitor_GEODATA : true // �湮���� geo�����͸� �����Ұ��� ����. �������� �ȳ����� ���


		
	// security -server
	//security_LEVEL = 3,
	//securtiy_OPTION = 'DISCONNECT', //����͸��� �̻����� �������� 



	// visitor_check.js
	// ���������� ���� �����Ѱ�(��ġ ��km)����, ���Ӽ�? && 300ȸ�̻� ���� �߻��Ͽ�����
	// oldkey ��ȸ related�� ����
	
	// highperformance.js
	// related ���Ե� ������ ���Ϻм��� �ջ�
	// ������ �����Ұ�����(�� vs ��)
	

	// realtime.js
	// 

//�������� ���Ϻм� ����

	// geo.js
	// ����� ��ġ
	// ����ڰ� �����̰� �ִ��� ��ü�ϰ��ִ���
	// �����̰� �ִٸ� �����̴� ���Ϻм�. �������� ������ �ȴ���(�ӵ��� ����)
	// 

}
	

