import {IBpmnModdle,
  IBpmnModeler,
  IBpmnModelerConstructor,
  IDefinition,
  IEvent,
  IEventBus,
  IForm,
  IFormElement,
  IModdleElement,
  IModeling,
  IPageModel,
  ISection,
  IShape} from '../../../../../../contracts';

export class BasicsSection implements ISection {

  public path: string = '/sections/basics/basics';
  public canHandleElement: boolean = false;
  private isFormSelected: boolean = false;

  private businessObjInPanel: IFormElement;
  private eventBus: IEventBus;
  private moddle: IBpmnModdle;
  private modeler: IBpmnModeler;

  private forms: Array<IForm>;
  private selectedForm: IForm;
  private selectedIndex: number;
  private types: Array<string> = ['string', 'long', 'boolean', 'date', 'enum', 'custom type'];
  private selectedType: string;
  private customType: string;
  private formElement: IFormElement;

  private activeListElementId: string;

  public async activate(model: IPageModel): Promise<void> {
    this.eventBus = model.modeler.get('eventBus');
    this.moddle = model.modeler.get('moddle');
    this.modeler = model.modeler;
    const selectedEvents: Array<IShape> = this.modeler.get('selection')._selectedElements;
    if (selectedEvents[0]) {
      this.businessObjInPanel = selectedEvents[0].businessObject;
      this.init();
    }

    this.eventBus.on(['element.click', 'shape.changed', 'selection.changed'], (event: IEvent) => {
      if (event.element) {
        this.businessObjInPanel = event.element.businessObject;
      }
      this.init();
    });
  }

  private init(): void {
    this.isFormSelected = false;
    this.canHandleElement = this.checkElement(this.businessObjInPanel);
    if (this.canHandleElement) {
      this.formElement = this.getFormElement();
      this.reloadForms();
    }
  }

  private getXML(): string {
    let xml: string;
    this.modeler.saveXML({format: true}, (err: Error, diagrammXML: string) => {
      xml = diagrammXML;
    });
    return xml;
  }

  private selectForm(form: IForm): void {
    this.selectedForm = form;
    this.selectedType = this.getTypeOrCustomType(form.type);
    this.selectedIndex = this.getSelectedIndex();
    this.isFormSelected = true;
  }

  private reloadForms(): void {
    this.forms = [];

    if (!this.formElement || !this.formElement.fields) {
      return;
    }

    const forms: Array<IForm> = this.formElement.fields;
    for (const form of forms) {
      if (form.$type === `camunda:FormField`) {
        this.forms.push(form);
      }
    }
  }

  public checkElement(element: IModdleElement): boolean {
    if (element.$type === 'bpmn:UserTask') {
      return true;
    } else {
      return false;
    }
  }

  private updateId(): void {
    this.formElement.fields[this.selectedIndex].id = this.selectedForm.id;
  }

  private updateDefaultValue(): void {
    this.formElement.fields[this.selectedIndex].label = this.selectedForm.label;
  }

  private updateLabel(): void {
    this.formElement.fields[this.selectedIndex].defaultValue = this.selectedForm.defaultValue;
  }

  private updateType(): void {
    let type: string;

    if (this.selectedType === `custom type`) {
      type = this.customType;
    } else {
      type = this.selectedType;
    }

    this.formElement.fields[this.selectedIndex].type = type;
  }

  private async removeForm(): Promise<void> {
    this.formElement.fields.splice(this.selectedIndex, 1);
    this.isFormSelected = false;
    this.selectedForm = undefined;
    this.selectedIndex = undefined;
    this.selectedType = undefined;
    this.reloadForms();
  }

  private async addForm(): Promise<void> {

    const bpmnForm: IForm = this.moddle.create('camunda:FormField',
                                                {
                                                  id: `Form_${this.generateRandomId()}`,
                                                  type: null,
                                                  label: ``,
                                                  defaultValue: ``,
                                                });

    if (!this.formElement.fields) {
      this.formElement.fields = [];
    }

    this.formElement.fields.push(bpmnForm);
    this.forms.push(bpmnForm);
    this.selectForm(bpmnForm);

  }

  private getTypeOrCustomType(type: string): string {
    if (this.types.includes(type) || type === null) {
      this.customType = '';
      return type;
    } else {
      this.customType = type;
      return 'custom type';
    }
  }

  private getSelectedIndex(): number {
    const forms: Array<IForm> = this.formElement.fields;
    for (let index: number = 0; index < forms.length; index++) {
      if (forms[index].id === this.selectedForm.id) {
        return index;
      }
    }
  }

  private getFormElement(): IModdleElement {
    let formElement: IModdleElement;

    if (!this.businessObjInPanel.extensionElements) {
      this.createExtensionElement();
    }

    for (const extensionValue of this.businessObjInPanel.extensionElements.values) {
      if (extensionValue.$type === 'camunda:FormData') {
        formElement = extensionValue;
      }
    }

    if (!formElement) {
      const fields: Array<IModdleElement> = [];
      const extensionFormElement: IModdleElement = this.moddle.create('camunda:FormData', {fields: fields});
      this.businessObjInPanel.extensionElements.values.push(extensionFormElement);

      return this.getFormElement();
    }

    return formElement;
  }

  private createExtensionElement(): void {
    const values: Array<IFormElement> = [];
    const fields: Array<IForm> = [];
    const formData: IFormElement = this.moddle.create('camunda:FormData', {fields: fields});
    values.push(formData);

    this.businessObjInPanel.formKey = `Form Key`;
    const extensionElements: IModdleElement = this.moddle.create('bpmn:ExtensionElements', {values: values});
    this.businessObjInPanel.extensionElements = extensionElements;
  }

  private generateRandomId(): string {
    let randomId: string = '';
    const possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const randomIdLength: number = 8;
    for (let i: number = 0; i < randomIdLength; i++) {
      randomId += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return randomId;
  }

  private deleteExtensions(): void {
    delete this.businessObjInPanel.extensionElements;
    delete this.businessObjInPanel.formKey;
  }

  private clearFormKey(): void {
    this.businessObjInPanel.formKey = '';
  }

  private clearId(): void {
    this.selectedForm.id = '';
  }

  private clearType(): void {
    this.customType = '';
  }

  private clearLabel(): void {
    this.selectedForm.label = '';
  }

  private clearValue(): void {
    this.selectedForm.defaultValue = '';
  }

}
