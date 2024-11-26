// State 정의
const initialState = {
    templates: [],
    selectedTemplateId: null
};

// Template 엔티티 정의
const TemplateEntity = {
    id: null,
    title: '',
    content: '',
    createdAt: ''
};

class Store {
    // 생성자 매개변수로 상태 설정 할 수 있도록 함
    constructor(state = {}) {
        // 초기 상태 설정
        this.state = {
            ...initialState,
            ...state
        };
        
        // notify 를 받을 콜백 함수 목록
        this.listeners = [];
        
        // localStorage에서 데이터 로드
        this.loadFromStorage();
    }

    // =========================================
    // Getters
    // =========================================
    
    // 상태 가져오기
    getState() {
        return this.state;
    }

    // 선택된 템플릿 가져오기
    getSelectedTemplate() {
        return this.state.templates.find(
            template => template.id === this.state.selectedTemplateId
        );
    }

    // =========================================
    // Mutations (상태 변경)
    // =========================================
    
    // 상태 업데이트
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }

    // =========================================
    // Actions (비즈니스 로직)
    // =========================================
    
    // 템플릿 추가
    addTemplate(title) {
        const newTemplate = {
            ...TemplateEntity,
            id: Date.now(),
            title,
            createdAt: new Date().toISOString()
        };

        const newTemplates = [newTemplate, ...this.state.templates];
        this.setState({ 
            templates: newTemplates,
            selectedTemplateId: newTemplate.id 
        });
        this.saveToLocalStorage();
    }

    // 템플릿 업데이트
    updateTemplate(templateId, updates) {
        const newTemplates = this.state.templates.map(template =>
            template.id === templateId ? { ...template, ...updates } : template
        );
        this.setState({ templates: newTemplates });
        this.saveToLocalStorage();
    }

    // 템플릿 삭제
    deleteTemplate(templateId) {
        const newTemplates = this.state.templates.filter(template => 
            template.id !== templateId
        );
        this.setState({ 
            templates: newTemplates,
            selectedTemplateId: newTemplates.length > 0 ? newTemplates[0].id : null
        });
        this.saveToLocalStorage();
    }

    // 템플릿 선택
    selectTemplate(templateId) {
        this.setState({ selectedTemplateId: templateId });
    }

    // =========================================
    // Storage 유틸리티
    // =========================================
    
    // localStorage에서 데이터 로드
    loadFromStorage() {
        try {
            const storedTemplates = localStorage.getItem('messageTemplates');
            if (storedTemplates) {
                const templates = JSON.parse(storedTemplates);
                this.setState({ templates });
            }
        } catch (error) {
            console.error('Failed to load templates from storage:', error);
        }
    }

    // LocalStorage 저장
    saveToLocalStorage() {
        try {
            localStorage.setItem('messageTemplates', JSON.stringify(this.state.templates));
        } catch (error) {
            console.error('Failed to save templates to storage:', error);
        }
    }

    // =========================================
    // 옵저버 패턴 구현
    // =========================================
    
    // 리스너 등록
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // 상태 변경 알림
    notify() {
        this.listeners.forEach(listener => listener());
    }

    // =========================================
    // API 통신 (예시)
    // =========================================
    
    // 서버에서 템플릿 로드 (예시)
    async loadTemplatesFromServer(url) {
        try {
            const response = await fetch(url);
            const templates = await response.json();
            this.setState({ templates });
        } catch (error) {
            console.error('Failed to load templates from server:', error);
        }
    }
}
