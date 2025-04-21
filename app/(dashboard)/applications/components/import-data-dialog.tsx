"use client"

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react';
import { createApplication } from "@/services/application-service";
import { Application } from '@/types/application';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

const ImportDataDialog = ({ isImportOpen, onClose }: { isImportOpen: boolean; onClose: () => void }) => {
    const [file, setFile] = useState<File | null>(null);
    const { toast } = useToast();

    const router = useRouter();

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === 'text/csv') {
            setFile(droppedFile);
        }
    };

    const handleDownloadTemplate = () => {
        const templateUrl = '/template.csv';
        const link = document.createElement('a');
        link.href = templateUrl;
        link.download = 'template.csv';
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportCSV = async () => {
        if (file) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const text = e.target?.result as string;
            const rows = text
              .split('\n')
              .filter(row => row.trim() !== '')
              .map(row => row.split(','));

            const rawHeaders = rows.shift()?.map(header => header.trim()) ?? [];

            // Map CSV headers to internal field keys
            const headerMap: Record<string, keyof Application> = {
              "Company": "company",
              "URL": "url",
              "Job Title": "jobTitle",
              "Requirements": "requirements",
              "Applied Through": "appliedThrough",
              "Salary": "salary",
              "Location": "location",
              "Location Type(On-site/Remote/Hybrid)": "locationType",
              "Date Applied(YYYY-MM-DD)": "dateApplied",
            };

            const csvData = rows.map(row => {
              return rawHeaders.reduce((obj, header, index) => {
                const key = headerMap[header];
                if (key) {
                  obj[key] = row[index]?.trim() ?? "";
                }
                return obj;
              }, {} as Application);
            });

            for (const data of csvData) await createApplication(data);

            toast({
                variant: "default",
                title: "Applications added",
                description: new Date().toISOString(),
            })

            onClose();
          };
          reader.readAsText(file);
        }
      };

    return (
        <Dialog open={isImportOpen} onOpenChange={onClose}>
            <DialogTrigger asChild>
                <button className="hidden">Open Dialog</button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='text-2xl'>Import Data</DialogTitle>
                    <DialogDescription>
                        Drag and drop your CSV file or use the buttons below.
                    </DialogDescription>
                </DialogHeader>
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="drop-zone h-52 rounded-lg flex justify-center items-center border-dashed border-2 border-gray-300 p-4 text-center"
                >
                    {file ? (
                        <>
                            <p>{file.name}</p>
                            <button onClick={() => setFile(null)} className="text-blue-500 cursor-pointer ml-2"><X className="h-4 w-4" /></button>
                        </>
                    ) : (
                        <p>Drag and drop your CSV file here or <span className="text-blue-500 cursor-pointer" onClick={() => document.getElementById('upload-input')?.click()}>click here.</span></p>
                    )}
                    <input id="upload-input" type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="hidden" />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={handleDownloadTemplate} className="bg-foreground text-background">
                        Download Template
                    </Button>
                    <Button variant="outline" onClick={handleImportCSV} className="bg-foreground text-background">
                        Import CSV
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ImportDataDialog;
