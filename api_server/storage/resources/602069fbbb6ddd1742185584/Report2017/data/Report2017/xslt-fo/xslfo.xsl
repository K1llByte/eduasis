<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0"
    xmlns:fo="http://www.w3.org/1999/XSL/Format"
    xmlns:r="http://xml.di.uminho.pt/report2007"
    xmlns:p="http://xml.di.uminho.pt/paragraph2007"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://xml.di.uminho.pt/report2007 file:report.xsd">
    
    <xsl:import href="fo-frontmatter.xsl"/>
    <xsl:import href="fo-body.xsl"/>
    
    <xsl:output method="xml" indent="yes"/>
    
    <xsl:template match="r:report">
        <fo:root>
            
            <fo:layout-master-set>
                
                <!-- Title page geometry ............................................................................... -->
                
                <fo:simple-page-master master-name="title-page"
                    page-width="210mm" page-height="297mm"
                    margin-top="3cm"   margin-bottom="3cm"
                    margin-left="2cm"  margin-right="2cm">
                    <fo:region-body margin-top="4cm" margin-bottom="4cm" margin-left="2cm" margin-right="2cm"/>
                    <fo:region-before extent="3cm"/>
                    <fo:region-after  extent="3cm"/>
                    <fo:region-start  extent="2cm"/>
                    <fo:region-end    extent="2cm"/>
                </fo:simple-page-master>
                
                <!-- Abstract page geometry ............................................................................... -->
                
                <fo:simple-page-master master-name="abstract">
                    <fo:region-body margin="1in"/>
                </fo:simple-page-master>
                
                <!-- Section page geometry ............................................................................... -->
                
                <fo:simple-page-master master-name="sec-first-page"
                    page-width="210mm" page-height="297mm"
                    margin-top="6cm"   margin-bottom="1.5cm"
                    margin-left="1cm"  margin-right="2cm">
                    <fo:region-body margin="1.5"/>
                </fo:simple-page-master>
                
                <fo:simple-page-master master-name="sec-all-pages"
                    page-width="210mm" page-height="297mm"
                    margin-top="1.5cm"   margin-bottom="1.5cm"
                    margin-left="1cm"  margin-right="2cm">
                    <fo:region-body margin="1.5"/>
                </fo:simple-page-master>
                
                <fo:page-sequence-master master-name="body-sequence">
                    <fo:single-page-master-reference master-reference="sec-first-page"/>
                    <fo:repeatable-page-master-reference master-reference="sec-all-pages"/>
                </fo:page-sequence-master>
                
            </fo:layout-master-set>
            
            <!-- Geração das Páginas ..................................................................................... -->
            
            <fo:page-sequence master-reference="title-page">
                <fo:static-content flow-name="xsl-region-before" text-align="right">
                    <fo:block display-align="center">
                        <fo:external-graphic src="url('um-logo.png')" content-height="3cm"/>
                    </fo:block>
                </fo:static-content>
                <fo:flow flow-name="xsl-region-body">
                    <xsl:apply-templates select="frontmatter"/> 
                </fo:flow>
            </fo:page-sequence>
            
            <fo:page-sequence master-reference="abstract">
                <fo:flow flow-name="xsl-region-body">
                    <xsl:apply-templates select="frontmatter/abstract"/>
                </fo:flow>  
            </fo:page-sequence> 
            
            <xsl:apply-templates select="body"/>
                
        </fo:root>
    </xsl:template>
    


</xsl:stylesheet>
