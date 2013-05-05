#! /usr/bin/env python

__author__ = 'Jacob Portnoff'
__email__ = 'jacob.portnoff@ischool.berkeley.edu'
__python_version = '2.7'

import re
import pandas as pd
import os
import numpy

def main():
	#testCSV()
	loc = "/Users/jacobportnoff/Desktop/totalTable.csv"
	outputs = allResults(loc)
	#flatFile=combineDataSets(csvs)
	#omg()

def omg():
	files = ['0B4C02C7-935D-411C-92C0-EAEC4BF0CFFD','00B7C61A-82E5-42E1-B9C0-6B39C5BC552F','0BD2FD3D-0B9C-49F6-9D7B-AF561177976B','0C0D9F40-F5C6-444B-A4F3-644484CF9932','0D4B993E-0F9B-4217-8F74-C7F0AD91959A','0D2155A8-2E1B-4A4D-9062-AF9E5477B1BB','0E2AC499-A478-4E65-B449-A119046B03C8','0ECEEAC1-2201-47B5-86AC-03AA38515989','0EE3F2CB-58B2-4C4A-9AEB-5A10DFE71BEC','0FD56724-1213-40D0-AD0B-E8BCFE268BB1']
	loc = "/Users/jacobportnoff/info247final/patientData/"
	div = "div3.csv"
	for f in files:
		bleh = loc+f+div
		table = pd.read_csv(bleh)
		table.to_csv(bleh,line_terminator='\n')

def testCSV():
	loc = "/Users/jacobportnoff/Desktop/patientData/BMIList.csv"
	test = file(loc,'r')
	i=0
	for line in test:
		print(line + " " + str(i))
		i+=1
	totalTable = pd.read_csv(loc)
	print(totalTable)
	totalTable.to_csv("/Users/jacobportnoff/Desktop/patientData/test.csv",line_terminator='\n')
	loc2="/Users/jacobportnoff/Desktop/patientData/test.csv"
	test = file(loc2,'r')
	i=0
	for line in test:
		print(line + " " + str(i))
		i+=1

def allResults(loc):
	totalTable = pd.read_csv(loc)
	#labs(totalTable)
	#medications(totalTable)
	#patients1(totalTable)
	#patients2(totalTable)
	patients3(totalTable)
	#patients4(totalTable)
	#patients5(totalTable)
	#labConnect(totalTable)

def buildUniqueRows(changer,column):
	changer2 = changer[column].unique()
	count = 0
	#print(totalTable.ix[0,:].copy())
	print(changer2)
	for guid in changer2[1:]:
		#print(guid)
		if count == 0:
			changer3 = changer[(changer[column] == guid)]
			changer3 = changer3.reset_index()
			del changer3['index']
			print(changer3.head(1))
			changer3 = changer3.head(1)
		else:
			changer4 = changer[(changer[column] == guid)]
			changer4 = changer4.reset_index()
			del changer4['index']
			changer3 = pd.concat([changer3, changer4.head(1)])
			changer3.reset_index()
		if count%1000 == 0:
			print(changer3)
			print(guid + " " + str(count))
		count+=1
	changer3.reset_index()
	changer3.to_csv("/Users/jacobportnoff/Desktop/"+column+"startTable.csv",line_terminator='\n')
	return changer3

def labs(totalTable):
	#HL7Identifier	HL7Text	LabObservationGuid	LabPanelGuid	HL7CodingSystem	ObservationValue	Units	ReferenceRange	AbnormalFlags	ResultStatus	ObservationYear	UserGuid	IsAbnormalValue	Sequence
	v="tot"
	changer = pd.DataFrame(totalTable,columns=['PatientGuid','HL7Identifier','HL7Text','LabObservationGuid','LabPanelGuid','HL7CodingSystem','ObservationValue','Units','ReferenceRange','AbnormalFlags','ResultStatus','ObservationYear','IsAbnormalValue','Sequence'])
	changer3 = buildUniqueRows(changer,'LabObservationGuid')
	holder=changer3.groupby([changer3['HL7Text'],changer3['ReferenceRange']])
	#print(holder)
	print("use one")
	holder=holder.sum()
	holder=holder.sort('IsAbnormalValue',ascending=False)
	holder=holder.add_suffix('_Count').reset_index()
	print(holder)
	holder2=changer3.groupby([changer3['HL7Text'],changer3['ReferenceRange']]).count()
	holder2=holder2.sort('PatientGuid',ascending=False)
	holder2=holder2.add_suffix('_Count').reset_index()
	del holder2['HL7Text_Count']
	del holder2['LabObservationGuid_Count']
	del holder2['ReferenceRange_Count']
	del holder2['IsAbnormalValue_Count']
	print('little weapon')
	print(holder2)
	labs = pd.merge(holder2,holder,on=['HL7Text','ReferenceRange'],how='left')
	labs=labs.sort('PatientGuid_Count',ascending=False)
	labs=labs.reset_index()
	del labs['index']
	labs.to_csv("/Users/jacobportnoff/Desktop/"+v+"labsFin.csv",line_terminator='\n')
	#holder2.to_csv("/Users/jacobportnoff/Desktop/"+v+"labs2.csv",line_terminator='\n')

def medications(totalTable):
	print('all')
	medications = pd.DataFrame(totalTable,columns=['MedicationGuid','MedicationName_y','MedicationStrength','Schedule'])
	medications['Count']=1
	medications2 = buildUniqueRows(medications,'MedicationGuid')
	schedule = medications2.groupby(medications2['Schedule']).sum()
	schedule = schedule.sort('Count',ascending=False)
	schedule = schedule.add_suffix('_Count').reset_index()
	schedule['Count'] = schedule['Count_Count']
	del schedule['Schedule_Count']
	del schedule['Count_Count']
	schedule.to_csv("/Users/jacobportnoff/Desktop/schedule.csv",line_terminator='\n')
	meds = medications2.groupby(['MedicationName_y','MedicationStrength']).sum()
	meds = meds.sort('Count',ascending=False)
	meds = meds.add_suffix('_Count').reset_index()
	meds['Schedule'] = meds['Schedule_Count']/meds['Count_Count']
	meds['Count'] = meds['Count_Count']
	del meds['Count_Count']
	del meds['Schedule_Count']
	meds.to_csv("/Users/jacobportnoff/Desktop/meds.csv",line_terminator='\n')

# basics div
def patients1(totalTable):
	# PatientGuid	Gender	YearOfBirth	SmokingStatusGuid	VisitYear	Height	Weight	BMI	SystolicBP	DiastolicBP	RespiratoryRate	Temperature TranscriptGuid
	patient = pd.DataFrame(totalTable,columns=['PatientGuid','Gender','YearOfBirth','SmokingStatusGuid','VisitYear','Height','Weight','BMI','SystolicBP','DiastolicBP','RespiratoryRate','Temperature','TranscriptGuid'])
	patients = sepPatients(patient)
	count=0
	for patient in patients.keys():
		pat = patients[patient]
		transcripts = pat['TranscriptGuid'].unique()
		print("needed help")
		print(transcripts)
		latestYear = 1900
		for transcript in transcripts:
			patStats = pat[(pat['TranscriptGuid'] == transcript)]
			patStats = patStats.reset_index()
			patStats = patStats.head(1)
			if pd.isnull(patStats['VisitYear'])==False:
				year = int(patStats['VisitYear'])
			else:
				year = 1800
			if latestYear<year or latestYear==1900:
				finPatStats = patStats
				latestYear=year
			elif latestYear==year:
				if finPatStats['Weight']<patStats['Weight'] or pd.isnull(finPatStats['Weight'])==True:
					finPatStats['Weight']=patStats['Weight']
				if finPatStats['Height']<patStats['Height'] or pd.isnull(finPatStats['Height'])==True:
					finPatStats['Height']=patStats['Height']
				if finPatStats['SystolicBP']<patStats['SystolicBP'] or pd.isnull(finPatStats['SystolicBP'])==True:
					finPatStats['SystolicBP']=patStats['SystolicBP']
				if finPatStats['DiastolicBP']<patStats['DiastolicBP'] or pd.isnull(finPatStats['DiastolicBP'])==True:
					finPatStats['DiastolicBP']=patStats['DiastolicBP']	
				if finPatStats['RespiratoryRate']<patStats['RespiratoryRate'] or pd.isnull(finPatStats['RespiratoryRate'])==True:
					finPatStats['RespiratoryRate']=patStats['RespiratoryRate']   
				if finPatStats['Temperature']<patStats['Temperature'] or pd.isnull(finPatStats['Temperature'])==True:
					finPatStats['Temperature']=patStats['Temperature']
			else:
				if pd.isnull(finPatStats['Weight'])==True:
					finPatStats['Weight']=patStats['Weight']
				if pd.isnull(finPatStats['Height'])==True:
					finPatStats['Height']=patStats['Height']
				if pd.isnull(finPatStats['SystolicBP'])==True:
					finPatStats['SystolicBP']=patStats['SystolicBP']
				if pd.isnull(finPatStats['DiastolicBP'])==True:
					finPatStats['DiastolicBP']=patStats['DiastolicBP']	
				if pd.isnull(finPatStats['RespiratoryRate'])==True:
					finPatStats['RespiratoryRate']=patStats['RespiratoryRate']   
				if pd.isnull(finPatStats['Temperature'])==True:
					finPatStats['Temperature']=patStats['Temperature']
			print("check")
			finPatStats['Age'] = 2013-int(finPatStats['YearOfBirth'])
			print(finPatStats)
			finPatStats['NotSmoker'] = pd.isnull(finPatStats['SmokingStatusGuid'])
			finPatStats['BloodPressureStatus'] = BPStatus(finPatStats['SystolicBP'],finPatStats['DiastolicBP'])
			if pd.isnull(finPatStats['BMI'])==False:
				finPatStats['BMIStatus'] = BMIStatus(finPatStats['BMI'])
			elif pd.isnull(finPatStats['Weight'])==False and pd.isnull(finPatStats['Height'])==False:
				print("done it")
				print(str(finPatStats['Weight']) + " float " + str(finPatStats['Height']))
				finPatStats['BMI']=float((int(finPatStats['Weight'])*703)/int(finPatStats['Height'])**2)
				finPatStats['BMIStatus'] = BMIStatus(finPatStats['BMI'])
		if onTheList(finPatStats)==True and count==0:
			bigPatSats = finPatStats
			count+=1
		elif onTheList(finPatStats)==True and count<40:
			bigPatSats = pd.concat([bigPatSats,finPatStats])
			count+=1
		finPatStats.to_csv("/Users/jacobportnoff/Desktop/patientData/"+patient+"div1.csv",line_terminator='\n')
	del bigPatSats['index']
	bigPatSats.sort('BMI',ascending=False)
	#bigPatSats.reset_index()
	bigPatSats.to_csv("/Users/jacobportnoff/Desktop/patientData/BMIList.csv",line_terminator='\n')

def patients2(totalTable):
	# PatientGuid	AllergyGuid	AllergyType	StartYear_x	ReactionName	SeverityName	MedicationName_x
	patient = pd.DataFrame(totalTable,columns=['PatientGuid','AllergyGuid','AllergyType','StartYear_x','ReactionName','SeverityName','MedicationName_x'])
	patients = sepPatients(patient)
	for patient in patients.keys():
		pat = patients[patient]
		allergies = pat['AllergyGuid'].unique()
		print("brilliant")
 		print(allergies)
		count=0
		#patStats=pd.DataFrame()
		for allergy in allergies:
			if count==0:
				patStats = pat[(pat['AllergyGuid'] == allergy)]
				patStats = patStats.reset_index()
				patStats = patStats.head(1)
				allNull = False
				if pd.isnull(patStats['MedicationName_x'])==True and pd.isnull(patStats['AllergyType'])==True:
					print('do not add')
					allNull = True
				if pd.isnull(patStats['MedicationName_x'])!=True:
					patStats['AllergyName'] = patStats['MedicationName_x']
				elif pd.isnull(patStats['AllergyType'])!=True:
					patStats['AllergyName'] = patStats['AllergyType']
				if allNull == False:
					del patStats['MedicationName_x']
					del patStats['AllergyType']
					count+=1
					#patStats.to_csv("/Users/jacobportnoff/Desktop/patientData/"+patient+"div2.csv")
			else:
				patStats2 = pat[(pat['AllergyGuid'] == allergy)]
				patStats2 = patStats2.reset_index()
				patStats2 = patStats2.head(1)
				allNull = False
				if pd.isnull(patStats2['MedicationName_x'])==True and pd.isnull(patStats2['AllergyType'])==True:
					print('do not add')
					allNull = True
				if pd.isnull(patStats2['MedicationName_x'])!=True:
					patStats2['AllergyName'] = patStats2['MedicationName_x']
				elif pd.isnull(patStats2['AllergyType'])!=True:
					patStats2['AllergyName'] = patStats2['AllergyType']
				if allNull == False:
					del patStats2['MedicationName_x']
					del patStats2['AllergyType']
					count+=1
					patStats=pd.concat([patStats,patStats2])
		patStats['ReactionName'] = patStats['ReactionName'].str.replace(",","")
		patStats['SeverityName'] = patStats['SeverityName'].str.replace(",","")
		count=0
		allergyFound=False
		for col in patStats.columns:
			if col=="AllergyName":
				patStats['AllergyName'] = patStats['AllergyName'].str.replace(",","")
				allergyFound = True
			elif count==len(patStats.columns)-1 and allergyFound==False:
				patStats['AllergyName']="Unknown"
		patStats.to_csv("/Users/jacobportnoff/Desktop/patientData/"+patient+"div2.csv",line_terminator='\n')		

def patients3(totalTable):
	# PatientGuid	MedicationName_y	MedicationStrength	Schedule	PrescriptionGuid	MedicationGuid	PrescriptionYear	Quantity	NumberOfRefills	RefillAsNeeded	GenericAllowed
	patient = pd.DataFrame(totalTable,columns=['PatientGuid','MedicationName_y','MedicationStrength','Schedule','PrescriptionGuid','MedicationGuid','PrescriptionYear','Quantity','NumberOfRefills','RefillAsNeeded','GenericAllowed'])
	patients = sepPatients(patient)
	for patient in patients.keys():
		pat = patients[patient]
		pat['Quantity']=pat['Quantity'].fillna(0)
		medications = pat[(pat['Quantity'] > 10)]
		medications = medications['MedicationGuid'].unique()
		print('consulting with him')
		print(medications)
		count=0
		for medication in medications:
			if count==0:
				patStats = pat[(pat['MedicationGuid'] == medication)]
				patStats = patStats.reset_index()
				patStats = patStats.head(1)
				patList = patStats
				print(patStats['Quantity'].str.contains('^[0-9.]+$').all())
				if patStats['Quantity'].str.contains('^[0-9.]+$').all() == True:
					patStats['Quantity']=patStats['Quantity'].astype(numpy.float64)
					patStats['Quantity']=patStats['Quantity'].astype(numpy.int64)
				else:
					patStats['Quantity']=20
				patStats['index2']=count
				cols = patStats.columns.tolist()
				cols = cols[-1:] + cols[:-1]
				patStats = patStats[cols]
			else:
				patStats2 = pat[(pat['MedicationGuid'] == medication)]
				patStats2 = patStats2.reset_index()
				patStats2 = patStats2.head(1)
				if patStats2['Quantity'].str.contains('^[0-9.]+$').all()==True:
					patStats2['Quantity']=patStats2['Quantity'].astype(numpy.float64)
					patStats2['Quantity']=patStats2['Quantity'].astype(numpy.int64)
					patStats = pd.concat([patStats,patStats2])
					patStats['index2']=count
					cols = patStats.columns.tolist()
					cols = cols[-1:] + cols[:-1]
					patStats = patStats[cols]
			count+=1
			patStats.sort('Quantity',ascending=False,inplace=True)
			#print(patStats.reset_index())
			patStats['MedicationName_y']=patStats['MedicationName_y'].str.replace(",","")
			patStats['MedicationStrength']=patStats['MedicationStrength'].str.replace(",","")
			patStats.to_csv("/Users/jacobportnoff/Desktop/patientData/"+patient+"div3.csv",line_terminator='\n')

def patients4(totalTable):
	#PatientGuid	ICD9Code	DiagnosisDescription	StartYear_y	StopYear	Acute
	patient = pd.DataFrame(totalTable,columns=['PatientGuid','DiagnosisGuid','ICD9Code','DiagnosisDescription','StartYear_y','StopYear','Acute'])
	patients = sepPatients(patient)
	for patient in patients.keys():
		pat = patients[patient]
		medications = pat['DiagnosisGuid'].unique()
		print('subtle way')
		print(medications)
		count=0
		for medication in medications:
			if count==0:
				patStats = pat[(pat['DiagnosisGuid'] == medication)]
				patStats = patStats.reset_index()
				patStats = patStats.head(1)
			else:
				patStats2 = pat[(pat['DiagnosisGuid'] == medication)]
				patStats2 = patStats2.reset_index()
				patStats2 = patStats2.head(1)
				patStats = pd.concat([patStats,patStats2])
			count+=1
		patStats['DiagnosisDescription']=patStats['DiagnosisDescription'].str.replace(",","")
		patStats.to_csv("/Users/jacobportnoff/Desktop/patientData/"+patient+"div4.csv",line_terminator='\n')

def patients5(totalTable):
	#PatientGuid HL7Identifier	HL7Text	LabObservationGuid	LabPanelGuid	HL7CodingSystem	ObservationValue	Units	ReferenceRange	AbnormalFlags	ResultStatus	ObservationYear	UserGuid	IsAbnormalValue	Sequence
	patient = pd.DataFrame(totalTable,columns=['PatientGuid','LabObservationGuid','HL7Text','ReferenceRange','IsAbnormalValue'])
	patients = sepPatients(patient)
	for patient in patients.keys():
		pat = patients[patient]
		labs = pat[(pat['IsAbnormalValue'] == 1)]
		labs = labs['LabObservationGuid'].unique()
		print('oh really')
		print(labs)
		count=0
		for lab in labs:
			if count==0:
				patStats = pat[(pat['LabObservationGuid'] == lab)]
				patStats = patStats.reset_index()
				patStats = patStats.head(1)
			else:
				patStats2 = pat[(pat['LabObservationGuid'] == lab)]
				patStats2 = patStats2.reset_index()
				patStats2 = patStats2.head(1)
				patStats = pd.concat([patStats,patStats2])
			count+=1
			patStats.to_csv("/Users/jacobportnoff/Desktop/labsData/"+patient+"labs.csv",line_terminator='\n')

def labConnect(totalTable):
	abLabs = pd.read_csv("/Users/jacobportnoff/Downloads/fordoc.csv")
	abLabs['group'] = abLabs['HL7Text']+" "+abLabs['ReferenceRange']
	labNames = abLabs['group'].unique()
	changer = pd.DataFrame(totalTable,columns=['PatientGuid','HL7Identifier','HL7Text','LabObservationGuid','LabPanelGuid','HL7CodingSystem','ObservationValue','Units','ReferenceRange','AbnormalFlags','ResultStatus','ObservationYear','IsAbnormalValue','Sequence'])
	changer3 = buildUniqueRows(changer,'LabObservationGuid')
	changer3 = changer3.reset_index()
	print("hi")
	changer3['grouper']=changer3['HL7Text']+" "+changer3['ReferenceRange']
	btwn = changer3.groupby(changer3['grouper'])
	print(btwn.groups)
	for name, group in btwn:
		print name
		for lab in labNames:
			if lab == name:
				print group
				abGroups = group[(group['IsAbnormalValue']==1)]
				abGroups2 = abGroups.groupby(abGroups['PatientGuid']).count()
				#print(abGroups2)
				abGroups2 = abGroups2.sort('grouper',ascending=False)
				abGroups2 = abGroups2.add_suffix('_Count').reset_index()
				abGroups2.to_csv("/Users/jacobportnoff/Desktop/labsData/"+name[:4]+".csv",line_terminator='\n')
	'''
	patient = pd.DataFrame(totalTable,columns=['PatientGuid','LabObservationGuid','HL7Text','ReferenceRange','IsAbnormalValue'])
	patients = sepPatients(patient)
	for patient in patients.keys():
		pat = patients[patient]
		labs = labs['LabObservationGuid'].unique()
		count=0
		for lab in labs:

			for name in labNames:
	'''


def onTheList(patientStats):
	on=False
	if pd.isnull(patientStats['BMI'])==False:
		BMI = patientStats['BMI']
	else:
		BMI = 0
	sBP = patientStats['SystolicBP']
	dBP = patientStats['DiastolicBP']
	if BMI>=25 and BMI<30 and (sBP>=160 or dBP>=100) and pd.isnull(patientStats['SmokingStatusGuid'])==False:
		on=True
	elif BMI>=30 and (sBP>=140 or dBP>=90) and pd.isnull(patientStats['SmokingStatusGuid'])==False:
		on=True
	return on

def sepPatients(patient):
	column = 'PatientGuid'
	changer2 = patient[column].unique()
	count = 0
	dfs = {}
	#print(totalTable.ix[0,:].copy())
	print("love the blog")
	print(changer2)
	for guid in changer2:
		dfs[guid] = patient[(patient[column] == guid)]
	return dfs

def BMIStatus(BMI):
	BMIStatus = "UNK"
	if BMI<18.5:
		BMIStatus = "Underweight"
	elif BMI>=18.5 and BMI<25:
		BMIStatus = "Normal"
	elif BMI>=25 and BMI<30:
		BMIStatus = "Overweight"
	elif BMI>=30:
		BMIStatus = "Obese"
	return BMIStatus

def BPStatus(systolicBP,diastolicBP):
	BPCat = "UNK"
	if systolicBP<120 and diastolicBP<80:
		BPCat = "Normal"
	elif (systolicBP>=120 and systolicBP<=139) or (diastolicBP>=80 and diastolicBP<=89):
		BPCat="Prehypertension"
	elif (systolicBP>=140 and systolicBP<=159) or (diastolicBP>=90 and diastolicBP<=99):
		BPCat="Hypertension Stage 1"
	elif (systolicBP>=160 and systolicBP<=179) or (diastolicBP>=100 and diastolicBP<=109):
		BPCat="Hypertension Stage 2"
	elif (systolicBP>=180) or (diastolicBP>=110):
		BPCat="Hypertension Crisis"
	return BPCat

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
	totalSet = pd.merge(totalSet, csvs['Transcript'],on='PatientGuid',how='left')
	totalSet = pd.merge(totalSet, csvs['Medication'],on=['PatientGuid','DiagnosisGuid'],how='left')
	totalSet = pd.merge(totalSet, csvs['Prescription'],on=['PatientGuid','MedicationGuid'],how='left')
	print(totalSet)
	del csvs['LabResult']['TranscriptGuid']
	totalSet = pd.merge(totalSet, csvs['LabResult'],on=['PatientGuid','PracticeGuid'],how='left')
	print(totalSet)
	totalSet = pd.merge(totalSet, csvs['LabPanel'],on='LabResultGuid',how='left')
	print(totalSet)
	#totalSet = pd.merge(totalSet, csvs['TranscriptAllergy'],on='AllergyGuid',how='left')
	#totalSet = pd.merge(totalSet, csvs['TranscriptDiagnosis'],on='DiagnosisGuid',how='left')
	#totalSet = pd.merge(totalSet, csvs['TranscriptMedication'],on='MedicationGuid',how='left')
	totalSet = pd.merge(totalSet, csvs['LabObservation'],on=['LabPanelGuid'],how='left')
	print(totalSet)
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
	totalSet.to_csv("/Users/jacobportnoff/Desktop/totalTable.csv",line_terminator='\n')


if __name__ == '__main__':
	main()