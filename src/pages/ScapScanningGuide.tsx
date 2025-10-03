import React from "react";
import { Link } from "react-router-dom";

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-neutral-600 bg-brand-neutral-700/30 px-3 py-1 text-xs text-brand-neutral-100">
    {children}
  </span>
);

const StepSection = ({ stepNumber, title, children }: { 
  stepNumber: number; 
  title: string; 
  children: React.ReactNode; 
}) => (
  <div className="mb-8 rounded-2xl border border-brand-neutral-600 bg-brand-card p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent text-black font-bold text-sm">
        {stepNumber}
      </div>
      <h2 className="text-2xl font-semibold text-brand-accent">{title}</h2>
    </div>
    <div className="text-brand-neutral-200 space-y-4">
      {children}
    </div>
  </div>
);

const ImagePlaceholder = ({ description }: { description: string }) => (
  <div className="my-4 rounded-lg border-2 border-dashed border-brand-neutral-600 bg-brand-neutral-700/20 p-8 text-center">
    <div className="text-brand-neutral-400 text-sm">
      📷 Image placeholder: {description}
    </div>
  </div>
);

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-brand-neutral-800 rounded-lg p-4 font-mono text-sm text-brand-neutral-100 border border-brand-neutral-600">
    {children}
  </div>
);

const InfoBox = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-lg p-4 my-4">
    <h4 className="font-semibold text-brand-accent mb-2">{title}</h4>
    <div className="text-brand-neutral-200 text-sm">
      {children}
    </div>
  </div>
);

export default function ScapScanningGuide() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-bg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_10%,rgba(0,212,255,0.15),transparent_60%)]" />
      
      <main className="container mx-auto px-6 py-10 max-w-4xl">
        <div className="mb-6">
          <Link 
            to="/starter-projects" 
            className="inline-flex items-center gap-2 text-brand-accent hover:text-brand-accent/80 transition-colors"
          >
            ← Back to Starter Projects
          </Link>
        </div>
        
        <section>
          <Badge>Step-by-Step Guide</Badge>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl text-brand-neutral-50">
            Running <span className="text-brand-accent">scap scans</span> on Windows
          </h1>
          <p className="mt-4 max-w-3xl text-brand-neutral-200">
            Learn to perform security compliance scanning using SCAP (Security Content Automation Protocol) tools 
            to assess and validate system security configurations against established baselines.
          </p>
        </section>

        <div className="mt-12 space-y-8">
          <StepSection stepNumber={1} title="Download SCAP Tools">
            <p>
              The first step is to download the official SCAP tools from the Department of Defense Cyber Exchange.
            </p>
            
            <div className="space-y-3">
              <p><strong>1.1</strong> Navigate to the official DoD Cyber Exchange website:</p>
              <CodeBlock>https://public.cyber.mil/stigs/scap/</CodeBlock>
              
              <p><strong>1.2</strong> Look for the "SCAP Compliance Checker (SCC)" download section</p>
              <ImagePlaceholder description="Screenshot of public.cyber.mil SCAP download page" />
              
              <p><strong>1.3</strong> Download the latest version of SCC for Windows:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Look for "scc-X.X.X_Windows.zip" (where X.X.X is the version number)</li>
                <li>File size is typically 200-300 MB</li>
                <li>Ensure you're downloading from the official .mil domain</li>
              </ul>
            </div>

            <InfoBox title="Important Note">
              Always download SCAP tools from official government sources (public.cyber.mil) to ensure 
              authenticity and avoid potentially malicious versions.
            </InfoBox>
          </StepSection>

          <StepSection stepNumber={2} title="Install SCAP Compliance Checker">
            <p>
              Install the SCAP Compliance Checker on your Windows Server system.
            </p>
            
            <div className="space-y-3">
              <p><strong>2.1</strong> Extract the downloaded ZIP file to a dedicated folder:</p>
              <CodeBlock>C:\Tools\SCC\</CodeBlock>
              
              <p><strong>2.2</strong> Right-click on the installer and select "Run as Administrator"</p>
              <ImagePlaceholder description="Windows context menu showing 'Run as Administrator' option" />
              
              <p><strong>2.3</strong> Follow the installation wizard:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Accept the license agreement</li>
                <li>Choose installation directory (default: C:\Program Files\SCC)</li>
                <li>Select components to install (recommend full installation)</li>
                <li>Complete the installation process</li>
              </ul>
              
              <p><strong>2.4</strong> Verify installation by checking the installation directory:</p>
              <ImagePlaceholder description="File explorer showing installed SCC files and folders" />
            </div>

            <InfoBox title="System Requirements">
              <ul className="list-disc list-inside space-y-1">
                <li>Windows Server 2016 or later</li>
                <li>Administrator privileges required</li>
                <li>At least 2GB free disk space</li>
                <li>.NET Framework 4.7.2 or later</li>
              </ul>
            </InfoBox>
          </StepSection>

          <StepSection stepNumber={3} title="Download SCAP Content">
            <p>
              Download the appropriate SCAP security guides for your Windows Server version.
            </p>
            
            <div className="space-y-3">
              <p><strong>3.1</strong> Return to public.cyber.mil and navigate to the STIGs section</p>
              
              <p><strong>3.2</strong> Search for Windows Server SCAP content:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Windows Server 2019 STIG SCAP Package</li>
                <li>Windows Server 2022 STIG SCAP Package</li>
                <li>Or the version matching your server</li>
              </ul>
              
              <p><strong>3.3</strong> Download the SCAP package (typically a .zip file)</p>
              <ImagePlaceholder description="SCAP content download page showing available Windows Server packages" />
              
              <p><strong>3.4</strong> Extract the SCAP content to a working directory:</p>
              <CodeBlock>C:\SCAP_Content\Windows_Server_2019\</CodeBlock>
              
              <p><strong>3.5</strong> Verify the extracted content includes:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>XCCDF files (.xml)</li>
                <li>OVAL files (.xml)</li>
                <li>CPE dictionary files</li>
                <li>Documentation (README files)</li>
              </ul>
            </div>
          </StepSection>

          <StepSection stepNumber={4} title="Configure SCAP Compliance Checker">
            <p>
              Set up SCC with the downloaded SCAP content before running your first scan.
            </p>
            
            <div className="space-y-3">
              <p><strong>4.1</strong> Launch SCAP Compliance Checker as Administrator</p>
              <ImagePlaceholder description="SCC main interface showing menu options and content selection" />
              
              <p><strong>4.2</strong> Load the SCAP content:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Click "File" → "Load Content"</li>
                <li>Navigate to your extracted SCAP content directory</li>
                <li>Select the main XCCDF file (usually ends with _xccdf.xml)</li>
              </ul>
              
              <p><strong>4.3</strong> Configure scan options:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Select target system (local machine)</li>
                <li>Choose profile/benchmark to scan against</li>
                <li>Set output directory for results</li>
              </ul>
              
              <p><strong>4.4</strong> Review scan settings before proceeding</p>
              <ImagePlaceholder description="SCC configuration screen showing selected content and scan options" />
            </div>
          </StepSection>

          <StepSection stepNumber={5} title="Execute the SCAP Scan">
            <p>
              Run the compliance scan against your Windows Server system.
            </p>
            
            <div className="space-y-3">
              <p><strong>5.1</strong> Initiate the scan by clicking "Start Scan"</p>
              
              <p><strong>5.2</strong> Monitor scan progress:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Progress bar shows completion percentage</li>
                <li>Current rule being evaluated is displayed</li>
                <li>Scan duration varies (typically 15-45 minutes)</li>
              </ul>
              <ImagePlaceholder description="SCC scan progress window showing percentage complete and current rule" />
              
              <p><strong>5.3</strong> Wait for scan completion</p>
              <p>Do not interrupt the scan process as this may result in incomplete or invalid results.</p>
              
              <p><strong>5.4</strong> Review completion notification</p>
              <ImagePlaceholder description="Scan completion dialog showing success message and results location" />
            </div>

            <InfoBox title="Scan Performance Tips">
              <ul className="list-disc list-inside space-y-1">
                <li>Close unnecessary applications before scanning</li>
                <li>Ensure adequate system resources are available</li>
                <li>Run scans during maintenance windows when possible</li>
                <li>Consider excluding antivirus real-time scanning of SCC directory</li>
              </ul>
            </InfoBox>
          </StepSection>

          <StepSection stepNumber={6} title="Analyze Scan Results">
            <p>
              Review and interpret the SCAP scan results to understand your system's compliance status.
            </p>
            
            <div className="space-y-3">
              <p><strong>6.1</strong> Locate the results files in your specified output directory:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>HTML report (human-readable summary)</li>
                <li>XML results file (detailed technical data)</li>
                <li>ARF (Asset Reporting Format) file</li>
              </ul>
              
              <p><strong>6.2</strong> Open the HTML report in a web browser</p>
              <ImagePlaceholder description="HTML scan report showing compliance summary with pass/fail statistics" />
              
              <p><strong>6.3</strong> Review key sections of the report:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Executive Summary:</strong> Overall compliance percentage</li>
                <li><strong>Rule Results:</strong> Individual rule pass/fail status</li>
                <li><strong>Failed Rules:</strong> Items requiring remediation</li>
                <li><strong>System Information:</strong> Target system details</li>
              </ul>
              
              <p><strong>6.4</strong> Prioritize remediation efforts:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Focus on "High" severity findings first</li>
                <li>Group similar findings for efficient remediation</li>
                <li>Document any accepted risks or exceptions</li>
              </ul>
              
              <ImagePlaceholder description="Detailed view of failed rules showing severity levels and remediation guidance" />
            </div>
          </StepSection>

          <StepSection stepNumber={7} title="Generate Compliance Reports">
            <p>
              Create formal compliance documentation for audit and reporting purposes.
            </p>
            
            <div className="space-y-3">
              <p><strong>7.1</strong> Export results in required formats:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>PDF report for management review</li>
                <li>CSV export for tracking remediation</li>
                <li>XML for integration with other tools</li>
              </ul>
              
              <p><strong>7.2</strong> Include in your compliance documentation:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Scan date and time</li>
                <li>SCAP content version used</li>
                <li>System configuration at time of scan</li>
                <li>Remediation plan for failed items</li>
              </ul>
              
              <p><strong>7.3</strong> Schedule regular follow-up scans to track progress</p>
              <ImagePlaceholder description="Compliance tracking spreadsheet showing scan results over time" />
            </div>
          </StepSection>

          <div className="mt-12 rounded-2xl border border-brand-accent/30 bg-brand-accent/10 p-6">
            <h3 className="text-xl font-semibold text-brand-accent mb-4">Next Steps</h3>
            <div className="text-brand-neutral-200 space-y-2">
              <p>After completing your first SCAP scan:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Begin systematic remediation of failed compliance checks</li>
                <li>Establish a regular scanning schedule (monthly or quarterly)</li>
                <li>Integrate SCAP scanning into your change management process</li>
                <li>Consider automating scans using command-line tools</li>
                <li>Explore additional SCAP content for other systems and applications</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
