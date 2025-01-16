export const FIELD_TYPES = {
      TEXT: 'text',
      NUMBER: 'number',
      EMAIL: 'email',
      SELECT: 'select',
      RADIO: 'radio',
      CHECKBOX: 'checkbox'
    };

    export const DEFAULT_SETTINGS = {
      customerName: {
        type: FIELD_TYPES.TEXT,
        label: 'Customer Name',
        required: true
      },
      companyName: {
        type: FIELD_TYPES.TEXT,
        label: 'Company Name',
        required: true
      },
      email: {
        type: FIELD_TYPES.EMAIL,
        label: 'Email',
        required: true
      },
      
      // Floor Specifications
      floorSize: {
        type: FIELD_TYPES.NUMBER,
        label: 'Floor Size (m²)',
        required: true
      },
      floorFinishHeight: {
        type: FIELD_TYPES.NUMBER,
        label: 'Floor Finish Height (mm)',
        required: true
      },
      floorCapacity: {
        type: FIELD_TYPES.NUMBER,
        label: 'Floor Capacity (KPA)',
        required: true
      },
      deckingType: {
        type: FIELD_TYPES.SELECT,
        label: 'Decking Type',
        required: true,
        options: [
          '22mm Particleboard',
          '25mm Structural Ply'
        ]
      },
      steelFinish: {
        type: FIELD_TYPES.SELECT,
        label: 'Steel Finish',
        required: true,
        options: [
          'Galvanised',
          'Powder Coated'
        ]
      },

      // Additional Features
      staircase: {
        type: FIELD_TYPES.RADIO,
        label: 'Staircase',
        required: true,
        options: ['Yes', 'No']
      },
      handrailType: {
        type: FIELD_TYPES.SELECT,
        label: 'Handrail Type',
        required: false,
        options: [
          'No Handrail',
          'Standard',
          'Balustrading'
        ]
      },
      handrailLength: {
        type: FIELD_TYPES.NUMBER,
        label: 'Handrail Length (m)',
        required: false,
        dependsOn: {
          field: 'handrailType',
          value: 'No Handrail',
          inverse: true
        }
      },
      accessGate: {
        type: FIELD_TYPES.SELECT,
        label: 'Access Gate',
        required: true,
        options: [
          'No Gate',
          'Sliding Gate',
          'Up and Over Gate'
        ]
      },

      // Supply Details
      supplyType: {
        type: FIELD_TYPES.SELECT,
        label: 'Supply Type',
        required: true,
        options: [
          'Supply Only',
          'Supply with Delivery',
          'Supply and Install'
        ]
      },
      totalPrice: {
        type: FIELD_TYPES.NUMBER,
        label: 'Total Price (AUD)',
        required: true
      }
    };
