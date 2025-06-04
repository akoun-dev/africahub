
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TemplateHeader } from './country-templates/TemplateHeader';
import { TemplateCard } from './country-templates/TemplateCard';
import { TemplateDetails } from './country-templates/TemplateDetails';
import { CreateTemplateForm } from './country-templates/CreateTemplateForm';
import { ApplyTemplateForm } from './country-templates/ApplyTemplateForm';
import { mockTemplates } from './country-templates/mockData';

export const CountryTemplateManager: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('premium');

  const selectedTemplateData = mockTemplates.find(t => t.id === selectedTemplate);

  return (
    <div className="space-y-6">
      <TemplateHeader />

      <Tabs defaultValue="manage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="manage">Gestion Templates</TabsTrigger>
          <TabsTrigger value="create">Créer Template</TabsTrigger>
          <TabsTrigger value="apply">Appliquer Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-4">
          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate === template.id}
                onSelect={() => setSelectedTemplate(template.id)}
              />
            ))}
          </div>

          {/* Template Details */}
          {selectedTemplateData && (
            <TemplateDetails template={selectedTemplateData} />
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <CreateTemplateForm />
        </TabsContent>

        <TabsContent value="apply" className="space-y-4">
          <ApplyTemplateForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};
