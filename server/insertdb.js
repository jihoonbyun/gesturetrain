var Controller = new function(){

	// key.js
	this.gtcc_LENGTH = 50 // gtcc Ű ������ �ڸ���
	this.gtcc_ENCODING = true // Ű ���� ���ڵ�(lzw) ����
	this.gtcc_STORAGE = 'localStorage';// ����� ���丮��. ���ý��丮�� �������ϸ� �ڵ����� ��Ű����
	this.gtcc_COOKIE_EXP = false // ��Ű ��ȿ�Ⱓ.(����Ʈ : ��������)
	 
  // traffic.js
	// Ŭ���̾�Ʈ ����ҿ� �����صξ��ٰ� �����ϴ� ��� ����
	this.traffic_WAY = 'time' // �����ð���� vs �����뷮���
	this.traffic_SETTIME =3000 // �ð��ϰ��, 3�ʸ���
	this.traffic_KB = 5 // �뷮����ϰ��, 5kb����

	// monitoring.js
	// Ŭ���̾�Ʈ�� ���ɻ��¸� ����͸��ϴ� ��� ����
	this.monitoring_WAY = 'both' // �ε��ӵ� vs js���޸�
	this.monitoring_TIME_ARRAY =  ['fetchStart','responseEnd'] //��Ʈ��ũ ������
  //this.monitoring_TIME_LOADING = ['loadEventEnd', 'responseEnd'] //�������ε� 
  //this.monitoring_TIME_WHOLE = ['loadEventEnd', 'navigationStart'] //��ü���μ���
	this.monitoring_TIME_LIMIT = 4000 
	this.monitoring_MEMORY_LIMIT= 50//�޸� ����Ʈ �ۼ�������
}
	

