#! /usr/bin/env python

__author__ = 'Jacob Portnoff'
__email__ = 'jacob.portnoff@ischool.berkeley.edu'
__python_version = '2.7'

import re
import pandas as pd
import os

def main():
    #for file in trainingSet Folder, open csv
    #name df for the name of the file training_SyncPatient
    #join tables from SyncPatient by PatientGuid then use other keys from there
    #GroupBy PracticeGuid after big table is assembled for counts by practice
    #total_table['Practice_id == 'the one we want']
    loc = "/Users/jacobportnoff/Downloads/trainingSet"
    trainingSet = os.listdir(loc)
    csvs = {}
    for tSet in trainingSet:
    	fileTSet = loc+"/"+tSet
    	csvName = tSet[13:-4]
    	#print(csvName)
    	csvs[csvName]=pd.read_csv(fileTSet)
    	if csvName == 'Patient':
    		holder=csvs[csvName].groupby(csvs[csvName]['PracticeGuid']).count()
    		holder=holder.sort('PatientGuid',ascending=False)
    		holder=holder.add_suffix('_Count').reset_index()
    		check = holder.take([0])
    		#print(holder['PracticeGuid'])
    		#print('hello')
    		#print(check['PracticeGuid'][0])
    		bleh = str(check['PracticeGuid'][0])
    		#print(bleh)
    		csvs[csvName]=csvs[csvName][(csvs[csvName]['PracticeGuid'].str.contains(bleh))]
    		#print(csvs[csvName])
    flatFile=combineDataSets(csvs)

def combineDataSets(csvs):
	print(csvs['Patient'])
	'''
	totalSet = pd.merge(csvs['Patient'],csvs['Immunization'],left_on=True,left_index=True)
	print(totalSet)
	totalSet = pd.merge(totalSet, csvs['PatientCondition'],left_on=True,left_index=True)
	print(totalSet)
	totalSet = pd.merge(totalSet, csvs['PatientSmokingStatus'],left_on=True,left_index=True)
	print(totalSet)
	'''
	totalSet = pd.merge(csvs['Patient'],csvs['Immunization'],on='PatientGuid',how='left')
	totalSet = pd.merge(totalSet, csvs['PatientCondition'],on='PatientGuid',how='left')
	totalSet = pd.merge(totalSet, csvs['PatientSmokingStatus'],on='PatientGuid',how='left')
	totalSet = pd.merge(totalSet, csvs['Allergy'],on='PatientGuid',how='left')
	totalSet = pd.merge(totalSet, csvs['Diagnosis'],on='PatientGuid',how='left')
	#totalSet.to_csv("/Users/jacobportnoff/Desktop/trainer5.csv")
	totalSet = pd.merge(totalSet, csvs['Transcript'],on=['PatientGuid','UserGuid'],how='left')
	print(totalSet)
	#totalSet.to_csv("/Users/jacobportnoff/Desktop/trainer4.csv")
	totalSet = pd.merge(totalSet, csvs['Medication'],on=['PatientGuid','DiagnosisGuid','UserGuid'],how='left')
	totalSet = pd.merge(totalSet, csvs['Prescription'],on=['PatientGuid','MedicationGuid','UserGuid'],how='left')

	#print(totalSet)
	#totalSet.to_csv("/Users/jacobportnoff/Desktop/trainer2.csv")
	print(totalSet)
	#totalSet = pd.merge(totalSet, csvs['TranscriptAllergy'],on='AllergyGuid',how='left')
	#totalSet = pd.merge(totalSet, csvs['TranscriptDiagnosis'],on='DiagnosisGuid',how='left')
	#totalSet = pd.merge(totalSet, csvs['TranscriptMedication'],on='MedicationGuid',how='left')
	totalSet = pd.merge(totalSet, csvs['LabResult'],on=['PatientGuid','TranscriptGuid','UserGuid'],how='left')
	totalSet = pd.merge(totalSet, csvs['LabPanel'],on='LabResultGuid',how='left')
	totalSet = pd.merge(totalSet, csvs['LabObservation'],on=['LabPanelGuid','UserGuid'],how='left')
	'''
	'Patient'
	'Immunization'
	'PatientCondition'
	'PatientSmokingStatus'
	'Prescription'
	'Medication'
	'Allergy'
	'Diagnosis'
	'LabResult'
	'Transcript'
	'TranscriptAllergy'
	'TranscriptDiagnosis'
	'TranscriptMedication'
	'LabPanel'
	'LabObservation'
	'''
	totalSet.to_csv("/Users/jacobportnoff/Desktop/trainer3.csv")


if __name__ == '__main__':
    main()