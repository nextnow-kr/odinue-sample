class MessageTemplateComponent {
    constructor(containerId, store) {
        if (!store) throw new Error('Store is required');
        
        this.containerId = containerId;
        this.$container = $(`#${containerId}`);
        this.store = store;
        this.updateTimeout = null;
        
        // Store 구독 함수도 객체이기 때문에 배열에 저장 가능 하다.
        this.store.subscribe(() => {
            this.render();
        });
        
        this.initialize();
    }

    initialize() {
        this.render();
        this.bindEvents();
    }

    handleTemplateClick(e) {
        const templateId = Number($(e.currentTarget).data('id'));
        this.store.selectTemplate(templateId);
    }

    handleTemplateAdd(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const title = e.target.value.trim();
            if (title) {
                this.store.addTemplate(title);
                e.target.value = '';
            }
        }
    }

    handleContentUpdate(e) {
        const selectedTemplate = this.store.getSelectedTemplate();
        if (!selectedTemplate) return;

        const content = e.target.value;
        this.debounce(() => {
            this.store.updateTemplate(selectedTemplate.id, { content });
        }, 100);
    }

    bindEvents() {
        this.$container
            .on('click', '.template-item', this.handleTemplateClick.bind(this))
            .on('keypress', '.add-template-input', this.handleTemplateAdd.bind(this))
            .on('input', '.message-content', this.handleContentUpdate.bind(this));
    }

    debounce(fn, delay) {
        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(fn, delay);
    }

    formatDate(date) {
        return new Date(date).toLocaleString();
    }

    getStyles() {
        return `
            <style>
                .template-list {
                    background-color: #f5f5f5;
                    border-right: 1px solid #ddd;
                }

                .template-item {
                    padding: 15px;
                    margin-bottom: 10px;
                    background: white;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .template-item:hover {
                    transform: translateX(5px);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }

                .template-item.selected {
                    background: #e3f2fd;
                    border-color: #2196f3;
                }

                .add-template {
                    margin-bottom: 20px;
                }

                .add-template input {
                    width: 100%;
                    padding: 10px;
                    border: 2px solid #ddd;
                    border-radius: 4px;
                }

                .message-content {
                    width: 100%;
                    height: 200px;
                    padding: 10px;
                    margin: 20px 0;
                    border: 2px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                    resize: vertical;
                }

                .message-content:focus {
                    border-color: #2196f3;
                    outline: none;
                }

                .message-editor {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                }

                .message-editor h3 {
                    margin-bottom: 15px;
                    color: #333;
                }

                .created-at {
                    font-size: 12px;
                    color: #666;
                    margin-top: 5px;
                }
            </style>
        `;
    }

    renderTemplateList(templates, selectedTemplateId) {
        return templates.map(template => `
            <div class="template-item ${template.id === selectedTemplateId ? 'selected' : ''}"
                 data-id="${template.id}">
                <div class="template-title">${template.title}</div>
                <div class="created-at">
                    ${this.formatDate(template.createdAt)}
                </div>
            </div>
        `).join('');
    }

    renderEditor(selectedTemplate) {
        if (!selectedTemplate) return '';
        return `
            <div class="message-editor">
                <h3>메시지 내용</h3>
                <textarea class="message-content" 
                          data-template-id="${selectedTemplate.id}"
                          placeholder="메시지 내용을 입력하세요...">${selectedTemplate.content || ''}</textarea>
            </div>
        `;
    }

    shouldSkipRender(selectedTemplate) {
        const $existingTextarea = this.$container.find('.message-content');
        return $existingTextarea.length && 
               selectedTemplate && 
               $existingTextarea.data('template-id') === selectedTemplate.id;
    }

    render() {
        const state = this.store.getState();
        const selectedTemplate = this.store.getSelectedTemplate();
        
        if (this.shouldSkipRender(selectedTemplate)) return;
        
        const template = `
            ${this.getStyles()}
            <h2>메시지 템플릿</h2>
            <div class="add-template">
                <input type="text" class="add-template-input" placeholder="새로운 템플릿 제목을 입력하세요...">
            </div>
            <div class="template-list template-items">
                ${this.renderTemplateList(state.templates, state.selectedTemplateId)}
            </div>
            ${this.renderEditor(selectedTemplate)}
        `;
        
        this.$container.html(template);
    }
}
