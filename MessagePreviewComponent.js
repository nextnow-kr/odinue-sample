class MessagePreviewComponent {
    constructor(containerId, store) {

        // Store 구독 및 Container 위치 변수값 지정
        if (!store) throw new Error('Store is required');        
        this.containerId = containerId;
        this.$container = $(`#${containerId}`);
        this.store = store;
        
        // Store 구독 
        // Store 상태 변경 알림 받을 콜백
        this.store.subscribe(() => {
            this.render();
        });
        
        this.initialize();
    }

    initialize() {
        this.render();
    }

    formatContent(content) {
        if (!content) return '';
        return content
            .split('\n')
            .map(line => line.trimStart())
            .join('<br>');
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    // CSS
    getStyles() {
        return `
            <style>
                .phone-preview {
                    display: flex;
                    justify-content: center;
                    padding: 20px;
                }

                .phone-frame {
                    width: 300px;
                    height: 600px;
                    background: white;
                    border: 12px solid #333;
                    border-radius: 30px;
                    position: relative;
                    overflow: hidden;
                }

                .phone-header {
                    height: 50px;
                    background: #f8f8f8;
                    border-bottom: 1px solid #ddd;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: #333;
                }

                .phone-screen {
                    padding: 15px;
                    font-size: 14px;
                    line-height: 1.5;
                    text-align: left;
                    word-break: break-all;
                }

                .no-selection {
                    text-align: left;
                    color: #666;
                    padding: 0 40px;
                }

                .preview-container {
                    padding: 0;
                    margin: 0;
                }

                .preview-container h2 {
                    padding: 0 40px;
                    margin-bottom: 15px;
                }
            </style>
        `;
    }

    renderPhoneFrame(content) {
        return `
            <div class="phone-frame">
                <div class="phone-header">
                    ${this.getCurrentTime()}
                </div>
                <div class="phone-screen">
                    ${content}
                </div>
            </div>
        `;
    }

    renderNoSelection() {
        return `
            <div class="no-selection">
                <h2>선택된 템플릿 없음</h2>
                <p>왼쪽 목록에서 템플릿을 선택해주세요</p>
            </div>
        `;
    }

    renderPreviewContainer(content) {
        return `
            ${this.getStyles()}
            <div class="preview-container">
                <h2>미리보기</h2>
                <div class="phone-preview">
                    ${this.renderPhoneFrame(content)}
                </div>
            </div>
        `;
    }

    render() {
        const selectedTemplate = this.store.getSelectedTemplate();
        const content = selectedTemplate
            ? this.formatContent(selectedTemplate.content)
            : this.renderNoSelection();
            
        this.$container.html(this.renderPreviewContainer(content));
    }
}
