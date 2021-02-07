<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0"
    xmlns:fo="http://www.w3.org/1999/XSL/Format"
    xmlns:r="http://xml.di.uminho.pt/report2007"
    xmlns:p="http://xml.di.uminho.pt/paragraph2007"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://xml.di.uminho.pt/report2007 file:report.xsd">
    
    <xsl:output method="xml" indent="yes"/>
    
    <xsl:template match="r:report">
        <fo:root>
            
            <fo:layout-master-set>
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
            </fo:layout-master-set>
            
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
            
        </fo:root>
    </xsl:template>
    
    <xsl:template match="frontmatter">
        <fo:block font="Helvetica" text-align="center" font-size="36pt" font-weight="600"
            space-after="1cm" space-before="1cm">
            <xsl:value-of select="title"/>
        </fo:block>
        <xsl:apply-templates select="authors"/>
        <xsl:apply-templates select="date"/>
    </xsl:template>
    
    <xsl:template match="author">
        <fo:block font="Helvetica" text-align="center" font-size="24pt" font-weight="normal"
             space-before="1cm">
            <xsl:value-of select="name"/>
        </fo:block>
        <fo:block font="Helvetica" text-align="center" font-size="20pt" font-weight="normal">
            <xsl:value-of select="url"/>
        </fo:block>
        <fo:block font="Helvetica" text-align="center" font-size="20pt" font-weight="normal">
            <xsl:value-of select="affil"/>
        </fo:block>
    </xsl:template>
    
    <xsl:template match="date">
        <fo:block font="Helvetica" text-align="center" font-size="24pt" font-weight="800"
            space-before="2cm">
            <xsl:value-of select="."/>
        </fo:block>
    </xsl:template>

</xsl:stylesheet>
