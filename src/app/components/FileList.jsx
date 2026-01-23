import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { FileIcon, Download, Trash2, Eye, Image as ImageIcon } from 'lucide-react';

export default function FileList({ files = [], onDelete, onView }) {
  const [previewFile, setPreviewFile] = useState(null);

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const iconProps = { className: "h-6 w-6" };
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return <ImageIcon {...iconProps} />;
    } else if (['pdf'].includes(ext)) {
      return <FileIcon {...iconProps} />;
    } else if (['doc', 'docx'].includes(ext)) {
      return <FileIcon {...iconProps} />;
    } else if (['xls', 'xlsx'].includes(ext)) {
      return <FileIcon {...iconProps} />;
    } else if (['ppt', 'pptx'].includes(ext)) {
      return <FileIcon {...iconProps} />;
    } else {
      return <FileIcon {...iconProps} />;
    }
  };

  const getFileSize = (sizeInBytes) => {
    if (sizeInBytes < 1024) {
      return sizeInBytes + ' B';
    } else if (sizeInBytes < 1024 * 1024) {
      return (sizeInBytes / 1024).toFixed(2) + ' KB';
    } else {
      return (sizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
  };

  const getFileType = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return 'Image';
    } else if (['pdf'].includes(ext)) {
      return 'PDF Document';
    } else if (['doc', 'docx'].includes(ext)) {
      return 'Word Document';
    } else if (['xls', 'xlsx'].includes(ext)) {
      return 'Excel Spreadsheet';
    } else if (['ppt', 'pptx'].includes(ext)) {
      return 'PowerPoint Presentation';
    } else {
      return 'File';
    }
  };

  const handleView = (file) => {
    if (file.file_url) {
      setPreviewFile(file);
    } else if (onView) {
      onView(file);
    }
  };

  const handlePreviewClose = () => {
    setPreviewFile(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Files</CardTitle>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p>No files uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <div 
                  key={file.id || file.file_name} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {file.file_url && file.file_url.includes(file.file_name) && 
                     (file.file_name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) ? (
                      <img 
                        src={file.file_url} 
                        alt="Thumbnail" 
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="text-gray-500">
                        {getFileIcon(file.file_name)}
                      </div>
                    )}
                    
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate max-w-xs">
                        {file.file_name}
                      </p>
                      <div className="flex gap-2 text-xs text-gray-500">
                        <span>{getFileType(file.file_name)}</span>
                        <span>•</span>
                        <span>{getFileSize(file.file_size || 0)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(file)}
                      title="View file"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(file.file_url, '_blank')}
                      title="Download file"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(file)}
                      title="Delete file"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <Dialog open={!!previewFile} onOpenChange={handlePreviewClose}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{previewFile?.file_name}</DialogTitle>
            <DialogDescription>
              Preview of your uploaded file
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center">
            {previewFile?.file_url && previewFile.file_name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img 
                src={previewFile.file_url} 
                alt={previewFile.file_name} 
                className="max-w-full max-h-[60vh] object-contain"
              />
            ) : (
              <div className="text-center py-8">
                <FileIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p>Preview not available for this file type</p>
                <p className="text-sm text-gray-500 mt-2">
                  {previewFile?.file_name} • {getFileSize(previewFile?.file_size || 0)}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}