
  //�� ��ü�� ���Ͼ��̿��� ���� handshake�� �������� Ŭ���̾�Ʈ�� ����
	// ���� ���� Ŭ���̾�Ʈ ���� ����
  // �ڵ����� �������� ��������
	// �ɼ��� ����� false �� �����ϴ�
	// if you want to switch off, just false
module.exports = Config = {	
	
	// key
	gtcc_ENCODING : true, // Ű ���� ���ڵ�(lzw) ����
	gtcc_STORAGE : 'localStorage',// localStorage or cookie. ����� ���丮��. ���ý��丮�� �������ϸ� �ڵ����� ��Ű����
	gtcc_COOKIE_EXP : 365, // ��Ű ��ȿ�Ⱓ. ���ú��� ���� ��(false : ��������-����)

	// traffic
	// Ŭ���̾�Ʈ ����ҿ� �����صξ��ٰ� �����ϴ� ��� ����
  // �����ð���� vs �����뷮��� vs �������������	
	// �ǽð� �޴��� Ŭ����������, �ﰢ������ ������, �ƴҰ��� ���ÿ� ������ �ɼǿ� ���� ����
	traffic_OPTION : 'time',	// auto, time, kb, query, realtime �� �� 1. �ڵ��ɼ��� ������ �ɼ��� �Ѱ����� �����ϸ� ����
	traffic_MAX_STORAGE_KB : 1024 * 1, // �뷮����ϰ��, Ŭ���̾�Ʈ�� ���ý��丮�� ��ü ��뷮 ����. ������ kb. �Ϲ������� 5mb���� �����Ѵ�
  //traffic_MAX_COOKIE_NUMBER : 10, // �뷮����ϰ��,��Ű �ϳ� �� 4096Byte. ������, ȣ��Ʈ �ϳ� �� 20�� ��Ű. �� ��Ű ���� 300��. �ִ� �뷮 : 1.2 MB
	traffic_TIME  : 1000, // �ð��ϰ��, 3�ʸ���
	traffic_QUERY : 3, // ��ġ������ 4�� �̻��� ���(��ġ������, �հ����� �����ٰ� ���� �ѵ��� �̺�Ʈ������ ��Ʈ ��ü)
	

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
	visitor_GEODATA : true, // �湮���� geo�����͸� �����Ұ��� ����. �������� �ȳ����� ���

 // zipbox contains
 //
 // compress_STAGE = 1
 // identifier, clientX ���� Ű������ �ҷ� &  ����
 // �� 70�� ��ü �����ȴ�.
 // zipbox[0] = stage
 // zipbox[1] = main datas
 // zipbox[2] = [[key][start,move,move,....end], [start,move,end..]]// lzw ����
 //  ....
 //
 // compress_STAGE = 2
 // �׳� ���ųְ� ���� �ϴ� ���
 // ��ġ����ŭ ��ü�� �����ȴ�.
 // �ַ� ���� �����Ͱ� ������ Ź���ϴ�
 // zipbox[0] = stage
 // zipbox[1] = main datas
 // zipbox[2] = [[key][start][move][end]] //lzw ����
 //
 //
 //  option = {...compress_LZW : true, compress_STAGE : 2 } 
 //  ��.
 //  ���߿� �� array�� push �ϴ°� vs ��ü �����ս��� ���غ���
 //  �ֱ� ���迡���� push�� ������ �������� ���� ���ִµ�, ����� ���Ͽ� �ϴ� ����Ѵ�
 //  �ܼ��� �Լ� ���� �Ӹ��ƴ϶�, ���ÿ����� I/O�� ����ؾ��Ѵ�.
 
	compress_LZW : false, // �ణ�� ������ �־ �ϴ� �����´�.	
	compress_STAGE : 2,	// ����ܰ� ���� 1,2 �� �� ���� 

		
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
	

