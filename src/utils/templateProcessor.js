import { processField } from './templateProcessing/fieldProcessor';
    import { processConditionals } from './templateProcessing/conditionalProcessor';
    import { processVariables } from './templateProcessing/variableProcessor';
    import { formatDate } from './dateFormatting';
    import { formatCurrency } from './formatters';

    export const processTemplate = async (template, audit, damageRecords, damagePrices) => {
      if (!template?.content || !audit) return '';
      
      // Process all fields with their formatted values
      const processedFields = {
        // Handle special fields
        date: {
          label: 'Date',
          value: formatDate(audit.audit_date)
        },
        referenceNumber: {
          label: 'Reference',
          value: `RA-${audit.reference_number}`
        },
        totalPrice: {
          label: 'Total Price (excl. GST)',
          value: formatCurrency(
            damageRecords.reduce((sum, record) => {
              const price = damagePrices[record.damage_type] || 0;
              return sum + parseFloat(price);
            }, 0)
          )
        },
        // Handle handrail display
        handrail: {
          label: 'Handrail',
          value: audit.handrail_type !== 'No Handrail' && audit.handrail_length
            ? `${audit.handrail_length}m of ${audit.handrail_type}`
            : audit.handrail_type || 'No Handrail'
        },
        // Handle access gate display
        accessGate: {
          label: 'Access Gate',
          value: audit.access_gate !== 'No Gate' ? audit.access_gate : 'No Gate'
        },
        accessGateType: {
          label: 'Access Gate Type',
          value: audit.access_gate !== 'No Gate' ? audit.access_gate : 'No Gate'
        }
      };

      // Process all other fields
      Object.entries(audit).forEach(([key, value]) => {
        if (processedFields[key]) return;
        processedFields[key] = {
          label: key,
          value: value
        };
      });

      let content = template.content;

      // Process template in order: conditionals first, then variables
      content = processConditionals(content, processedFields);
      content = processVariables(content, processedFields);

      // Process damage records
      if (content.includes('{{#each damage_records}}')) {
        let damageContent = '';
        damageRecords.forEach((record) => {
          let recordTemplate = content.match(/{{#each damage_records}}([\s\S]*?){{\/each}}/)[1];
          
          // Replace record fields
          const recordFields = {
            damage_type: record.damage_type,
            risk_level: record.risk_level,
            location_details: record.location_details,
            recommendation: record.recommendation,
            notes: record.notes || '',
            photo_url: record.photo_url || '',
            price: damagePrices[record.damage_type] || 0
          };

          Object.entries(recordFields).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            recordTemplate = recordTemplate.replace(regex, value);
          });

          // Process photo conditional
          if (record.photo_url) {
            recordTemplate = recordTemplate.replace(
              /{{#if photo_url}}([\s\S]*?){{\/if}}/g,
              '$1'
            );
          } else {
            recordTemplate = recordTemplate.replace(
              /{{#if photo_url}}[\s\S]*?{{\/if}}/g,
              ''
            );
          }

          damageContent += recordTemplate;
        });

        content = content.replace(
          /{{#each damage_records}}[\s\S]*?{{\/each}}/,
          damageContent
        );
      }

      // Clean up any remaining template tags
      content = content.replace(/{{#if\s+.*?}}.*?{{\/if}}/gs, '');
      content = content.replace(/{{.*?}}/g, '');

      return content;
    };
